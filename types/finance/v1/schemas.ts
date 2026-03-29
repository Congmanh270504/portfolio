import { z } from 'zod'

const mongoObjectIdRegex = /^[a-f\d]{24}$/i

const objectIdSchema = z.string().regex(mongoObjectIdRegex, 'Invalid Mongo ObjectId')
const positiveAmountSchema = z.number().int().positive()

const limitSchema = z.preprocess((value) => {
  if (typeof value === 'string' && value.trim().length > 0) {
    return Number(value)
  }

  return value
}, z.number().int().min(1).max(100))

const offsetSchema = z.preprocess((value) => {
  if (typeof value === 'string' && value.trim().length > 0) {
    return Number(value)
  }

  return value
}, z.number().int().min(0))

export const createExpenseShareSchema = z.object({
  memberId: objectIdSchema,
  amount: positiveAmountSchema,
})

export const createExpenseRequestSchema = z.object({
  groupId: objectIdSchema,
  title: z.string().trim().min(1).max(200),
  amount: positiveAmountSchema,
  paidByMemberId: objectIdSchema,
  participantMemberIds: z.array(objectIdSchema).min(1),
  shareStrategy: z.enum(['EQUAL', 'CUSTOM']).default('EQUAL'),
  shares: z.array(createExpenseShareSchema).optional(),
  notes: z.string().trim().max(500).optional(),
  occurredAt: z.string().datetime().optional(),
})

export const expenseHistoryQuerySchema = z.object({
  groupId: objectIdSchema,
  memberId: objectIdSchema.optional(),
  search: z.string().trim().max(200).optional(),
  fromDate: z.string().datetime().optional(),
  toDate: z.string().datetime().optional(),
  limit: limitSchema.optional().default(20),
  offset: offsetSchema.optional().default(0),
})

export const balancesSummaryQuerySchema = z.object({
  groupId: objectIdSchema,
})

export const insightsChartsQuerySchema = z.object({
  groupId: objectIdSchema,
  fromDate: z.string().datetime().optional(),
  toDate: z.string().datetime().optional(),
  bucket: z.enum(['day', 'week', 'month']).default('day'),
})

export const generateVietQrRequestSchema = z.object({
  bankBin: z.string().regex(/^\d{6}$/),
  accountNumber: z.string().trim().min(6).max(32),
  accountName: z.string().trim().max(80).optional(),
  amount: positiveAmountSchema,
  transferNote: z.string().trim().min(1).max(60),
})
