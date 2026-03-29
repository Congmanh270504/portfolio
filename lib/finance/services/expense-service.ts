import { Prisma } from '@prisma/client'

import { buildExpenseLedgerDeltas, applyLedgerDeltas } from '@/lib/finance/ledger'
import { FinanceError } from '@/lib/finance/errors'
import { prisma } from '@/lib/prisma'
import { resolveExpenseShares } from '@/lib/finance/split'
import {
  BalanceLedgerEntryV1,
  CreateExpenseV1Request,
  CreateExpenseV1Response,
  ExpenseHistoryItemV1,
  ExpenseHistoryQueryV1,
  ExpenseHistoryResponseV1,
} from '@/types/finance/v1/dto'

export async function createExpenseV1(input: CreateExpenseV1Request): Promise<CreateExpenseV1Response> {
  const participantMemberIds = [...new Set(input.participantMemberIds)]
  const shareStrategy = input.shareStrategy ?? (input.shares?.length ? 'CUSTOM' : 'EQUAL')
  const shares = resolveExpenseShares({
    totalAmount: input.amount,
    participantMemberIds,
    shareStrategy,
    customShares: input.shares,
  })

  return prisma.$transaction(async (tx) => {
    const group = await tx.group.findUnique({
      where: { id: input.groupId },
      select: { id: true },
    })

    if (!group) {
      throw new FinanceError('Group was not found', {
        status: 404,
        code: 'GROUP_NOT_FOUND',
      })
    }

    const requiredMemberIds = [...new Set([input.paidByMemberId, ...participantMemberIds])]
    const members = await tx.member.findMany({
      where: {
        groupId: input.groupId,
        isActive: true,
        id: { in: requiredMemberIds },
      },
      select: { id: true, name: true },
    })

    const memberById = new Map(members.map((member) => [member.id, member]))
    const missing = requiredMemberIds.filter((id) => !memberById.has(id))

    if (missing.length > 0) {
      throw new FinanceError('Some members are missing or inactive in the group', {
        status: 400,
        code: 'INVALID_GROUP_MEMBER',
        details: { missingMemberIds: missing },
      })
    }

    const createdExpense = await tx.expense.create({
      data: {
        groupId: input.groupId,
        paidByMemberId: input.paidByMemberId,
        title: input.title.trim(),
        amount: input.amount,
        shareStrategy,
        notes: input.notes?.trim() || null,
        occurredAt: input.occurredAt ? new Date(input.occurredAt) : new Date(),
      },
    })

    await tx.splitShare.createMany({
      data: shares.map((share) => ({
        expenseId: createdExpense.id,
        memberId: share.memberId,
        shareAmount: share.amount,
      })),
    })

    const ledgerDeltas = buildExpenseLedgerDeltas(input.paidByMemberId, shares)
    await applyLedgerDeltas({
      tx,
      groupId: input.groupId,
      sourceExpenseId: createdExpense.id,
      deltas: ledgerDeltas,
    })

    const expenseWithRelations = await tx.expense.findUnique({
      where: { id: createdExpense.id },
      include: {
        paidBy: {
          select: {
            id: true,
            name: true,
          },
        },
        splitShares: {
          include: {
            member: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    })

    if (!expenseWithRelations) {
      throw new FinanceError('Expense creation failed unexpectedly', {
        status: 500,
        code: 'EXPENSE_CREATE_FAILED',
      })
    }

    const involvedMemberIds = [...new Set([input.paidByMemberId, ...participantMemberIds])]
    const ledgerUpdatesRaw = await tx.balanceLedger.findMany({
      where: {
        groupId: input.groupId,
        amount: { gt: 0 },
        OR: [
          { fromMemberId: { in: involvedMemberIds } },
          { toMemberId: { in: involvedMemberIds } },
        ],
      },
      include: {
        fromMember: {
          select: { id: true, name: true },
        },
        toMember: {
          select: { id: true, name: true },
        },
      },
      orderBy: [{ amount: 'desc' }, { updatedAt: 'desc' }],
    })

    return {
      expense: mapExpenseToHistoryItem(expenseWithRelations),
      ledgerUpdates: ledgerUpdatesRaw.map((item) => ({
        ledgerId: item.id,
        groupId: item.groupId,
        fromMemberId: item.fromMemberId,
        fromMemberName: item.fromMember.name,
        toMemberId: item.toMemberId,
        toMemberName: item.toMember.name,
        amount: item.amount,
        sourceExpenseId: item.sourceExpenseId,
        updatedAt: item.updatedAt.toISOString(),
      })),
    }
  })
}

export async function listExpenseHistoryV1(query: ExpenseHistoryQueryV1): Promise<ExpenseHistoryResponseV1> {
  const limit = query.limit ?? 20
  const offset = query.offset ?? 0

  const where: Prisma.ExpenseWhereInput = {
    groupId: query.groupId,
  }

  if (query.memberId) {
    where.OR = [{ paidByMemberId: query.memberId }, { splitShares: { some: { memberId: query.memberId } } }]
  }

  if (query.search) {
    where.title = {
      contains: query.search,
      mode: 'insensitive',
    }
  }

  if (query.fromDate || query.toDate) {
    where.occurredAt = {
      gte: query.fromDate ? new Date(query.fromDate) : undefined,
      lte: query.toDate ? new Date(query.toDate) : undefined,
    }
  }

  const [totalCount, rows] = await prisma.$transaction([
    prisma.expense.count({ where }),
    prisma.expense.findMany({
      where,
      include: {
        paidBy: {
          select: {
            id: true,
            name: true,
          },
        },
        splitShares: {
          include: {
            member: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: [{ occurredAt: 'desc' }, { createdAt: 'desc' }],
      skip: offset,
      take: limit,
    }),
  ])

  return {
    items: rows.map(mapExpenseToHistoryItem),
    totalCount,
    limit,
    offset,
    hasMore: offset + rows.length < totalCount,
  }
}

function mapExpenseToHistoryItem(
  expense: Prisma.ExpenseGetPayload<{
    include: {
      paidBy: { select: { id: true; name: true } }
      splitShares: { include: { member: { select: { id: true; name: true } } } }
    }
  }>,
): ExpenseHistoryItemV1 {
  return {
    expenseId: expense.id,
    groupId: expense.groupId,
    title: expense.title,
    amount: expense.amount,
    paidByMemberId: expense.paidByMemberId,
    paidByMemberName: expense.paidBy.name,
    shareStrategy: expense.shareStrategy,
    shares: expense.splitShares.map((share) => ({
      memberId: share.memberId,
      memberName: share.member.name,
      amount: share.shareAmount,
    })),
    notes: expense.notes,
    occurredAt: expense.occurredAt.toISOString(),
    createdAt: expense.createdAt.toISOString(),
  }
}

export type { BalanceLedgerEntryV1 }
