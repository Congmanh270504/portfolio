import { Prisma } from '@prisma/client'

type LedgerDelta = {
  fromMemberId: string
  toMemberId: string
  amount: number
}

type ApplyLedgerDeltasInput = {
  tx: Prisma.TransactionClient
  groupId: string
  sourceExpenseId: string
  deltas: LedgerDelta[]
}

export function buildExpenseLedgerDeltas(
  paidByMemberId: string,
  shares: Array<{ memberId: string; amount: number }>,
): LedgerDelta[] {
  return shares
    .filter((share) => share.memberId !== paidByMemberId && share.amount > 0)
    .map((share) => ({
      fromMemberId: share.memberId,
      toMemberId: paidByMemberId,
      amount: share.amount,
    }))
}

export async function applyLedgerDeltas({
  tx,
  groupId,
  sourceExpenseId,
  deltas,
}: ApplyLedgerDeltasInput): Promise<void> {
  for (const delta of deltas) {
    await applySingleDelta({
      tx,
      groupId,
      sourceExpenseId,
      fromMemberId: delta.fromMemberId,
      toMemberId: delta.toMemberId,
      amount: delta.amount,
    })
  }
}

async function applySingleDelta({
  tx,
  groupId,
  sourceExpenseId,
  fromMemberId,
  toMemberId,
  amount,
}: {
  tx: Prisma.TransactionClient
  groupId: string
  sourceExpenseId: string
  fromMemberId: string
  toMemberId: string
  amount: number
}) {
  if (fromMemberId === toMemberId || amount <= 0) {
    return
  }

  const now = new Date()

  const reverseEntry = await tx.balanceLedger.findUnique({
    where: {
      groupId_fromMemberId_toMemberId: {
        groupId,
        fromMemberId: toMemberId,
        toMemberId: fromMemberId,
      },
    },
  })

  let remaining = amount

  if (reverseEntry) {
    if (reverseEntry.amount > remaining) {
      await tx.balanceLedger.update({
        where: { id: reverseEntry.id },
        data: {
          amount: reverseEntry.amount - remaining,
          lastComputedAt: now,
          sourceExpenseId,
        },
      })
      return
    }

    remaining -= reverseEntry.amount

    await tx.balanceLedger.delete({
      where: { id: reverseEntry.id },
    })
  }

  if (remaining <= 0) {
    return
  }

  await tx.balanceLedger.upsert({
    where: {
      groupId_fromMemberId_toMemberId: {
        groupId,
        fromMemberId,
        toMemberId,
      },
    },
    update: {
      amount: { increment: remaining },
      lastComputedAt: now,
      sourceExpenseId,
    },
    create: {
      groupId,
      fromMemberId,
      toMemberId,
      amount: remaining,
      sourceExpenseId,
      lastComputedAt: now,
    },
  })
}
