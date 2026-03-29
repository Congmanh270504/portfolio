import { prisma } from '@/lib/prisma'
import { BalancesSummaryQueryV1, BalancesSummaryResponseV1 } from '@/types/finance/v1/dto'

export async function getBalancesSummaryV1(query: BalancesSummaryQueryV1): Promise<BalancesSummaryResponseV1> {
  const [members, ledgerRows] = await prisma.$transaction([
    prisma.member.findMany({
      where: {
        groupId: query.groupId,
      },
      select: {
        id: true,
        name: true,
      },
      orderBy: { createdAt: 'asc' },
    }),
    prisma.balanceLedger.findMany({
      where: {
        groupId: query.groupId,
        amount: { gt: 0 },
      },
      include: {
        fromMember: {
          select: {
            id: true,
            name: true,
          },
        },
        toMember: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: [{ amount: 'desc' }, { updatedAt: 'desc' }],
    }),
  ])

  const netByMember = new Map<string, number>(members.map((member) => [member.id, 0]))

  for (const ledger of ledgerRows) {
    netByMember.set(ledger.fromMemberId, (netByMember.get(ledger.fromMemberId) ?? 0) - ledger.amount)
    netByMember.set(ledger.toMemberId, (netByMember.get(ledger.toMemberId) ?? 0) + ledger.amount)
  }

  const memberBalances = members
    .map((member) => ({
      memberId: member.id,
      memberName: member.name,
      netAmount: netByMember.get(member.id) ?? 0,
    }))
    .sort((a, b) => b.netAmount - a.netAmount)

  const totalOutstanding = ledgerRows.reduce((sum, row) => sum + row.amount, 0)

  return {
    groupId: query.groupId,
    generatedAt: new Date().toISOString(),
    totalOutstanding,
    ledger: ledgerRows.map((row) => ({
      ledgerId: row.id,
      groupId: row.groupId,
      fromMemberId: row.fromMemberId,
      fromMemberName: row.fromMember.name,
      toMemberId: row.toMemberId,
      toMemberName: row.toMember.name,
      amount: row.amount,
      sourceExpenseId: row.sourceExpenseId,
      updatedAt: row.updatedAt.toISOString(),
    })),
    memberBalances,
  }
}
