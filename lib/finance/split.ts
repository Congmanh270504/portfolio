import { FinanceError } from '@/lib/finance/errors'
import { ExpenseShareInputV1, ShareStrategyV1 } from '@/types/finance/v1/dto'

type ResolveExpenseSharesInput = {
  totalAmount: number
  participantMemberIds: string[]
  shareStrategy: ShareStrategyV1
  customShares?: ExpenseShareInputV1[]
}

export function resolveExpenseShares({
  totalAmount,
  participantMemberIds,
  shareStrategy,
  customShares = [],
}: ResolveExpenseSharesInput): ExpenseShareInputV1[] {
  if (!Number.isInteger(totalAmount) || totalAmount <= 0) {
    throw new FinanceError('Amount must be a positive integer', {
      code: 'INVALID_AMOUNT',
      status: 400,
    })
  }

  const participants = [...new Set(participantMemberIds)]

  if (participants.length === 0) {
    throw new FinanceError('At least one participant is required', {
      code: 'MISSING_PARTICIPANTS',
      status: 400,
    })
  }

  if (shareStrategy === 'CUSTOM') {
    return normalizeCustomShares(totalAmount, participants, customShares)
  }

  return splitEqualAmount(totalAmount, participants)
}

export function splitEqualAmount(totalAmount: number, participantMemberIds: string[]): ExpenseShareInputV1[] {
  const baseShare = Math.floor(totalAmount / participantMemberIds.length)
  let remainder = totalAmount - baseShare * participantMemberIds.length

  return participantMemberIds.map((memberId) => {
    const extraUnit = remainder > 0 ? 1 : 0
    remainder = Math.max(0, remainder - 1)

    return {
      memberId,
      amount: baseShare + extraUnit,
    }
  })
}

function normalizeCustomShares(
  totalAmount: number,
  participantMemberIds: string[],
  customShares: ExpenseShareInputV1[],
): ExpenseShareInputV1[] {
  if (customShares.length !== participantMemberIds.length) {
    throw new FinanceError('Custom shares must include all participants exactly once', {
      code: 'INVALID_CUSTOM_SHARES',
      status: 400,
    })
  }

  const customByMember = new Map<string, number>()

  for (const share of customShares) {
    if (!participantMemberIds.includes(share.memberId)) {
      throw new FinanceError('Custom shares include a non-participant member', {
        code: 'INVALID_CUSTOM_SHARES',
        status: 400,
      })
    }

    if (!Number.isInteger(share.amount) || share.amount <= 0) {
      throw new FinanceError('Custom share amounts must be positive integers', {
        code: 'INVALID_CUSTOM_SHARE_AMOUNT',
        status: 400,
      })
    }

    if (customByMember.has(share.memberId)) {
      throw new FinanceError('Each participant can appear only once in custom shares', {
        code: 'DUPLICATE_CUSTOM_SHARE_MEMBER',
        status: 400,
      })
    }

    customByMember.set(share.memberId, share.amount)
  }

  const normalized = participantMemberIds.map((memberId) => ({
    memberId,
    amount: customByMember.get(memberId) ?? 0,
  }))

  const totalCustom = normalized.reduce((sum, item) => sum + item.amount, 0)

  if (totalCustom !== totalAmount) {
    throw new FinanceError('Custom shares must sum exactly to expense amount', {
      code: 'CUSTOM_SHARE_SUM_MISMATCH',
      status: 400,
      details: { totalAmount, totalCustom },
    })
  }

  return normalized
}
