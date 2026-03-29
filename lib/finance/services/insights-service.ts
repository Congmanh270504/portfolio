import { Prisma } from '@prisma/client'

import { prisma } from '@/lib/prisma'
import {
  InsightBucketV1,
  InsightsChartsQueryV1,
  InsightsChartsResponseV1,
  InsightPointV1,
  TopPayerInsightV1,
} from '@/types/finance/v1/dto'

const DEFAULT_RANGE_DAYS = 30

export async function getInsightsChartsV1(query: InsightsChartsQueryV1): Promise<InsightsChartsResponseV1> {
  const bucket = query.bucket ?? 'day'
  const toDate = query.toDate ? new Date(query.toDate) : new Date()
  const fromDate = query.fromDate
    ? new Date(query.fromDate)
    : new Date(toDate.getTime() - DEFAULT_RANGE_DAYS * 24 * 60 * 60 * 1000)

  const where: Prisma.ExpenseWhereInput = {
    groupId: query.groupId,
    occurredAt: {
      gte: fromDate,
      lte: toDate,
    },
  }

  const expenses = await prisma.expense.findMany({
    where,
    include: {
      paidBy: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: { occurredAt: 'asc' },
  })

  const trend = buildTrend(expenses, bucket)
  const topPayers = buildTopPayers(expenses)
  const totalAmount = expenses.reduce((sum, item) => sum + item.amount, 0)

  return {
    groupId: query.groupId,
    fromDate: fromDate.toISOString(),
    toDate: toDate.toISOString(),
    bucket,
    totalAmount,
    expenseCount: expenses.length,
    trend,
    topPayers,
  }
}

function buildTrend(
  expenses: Prisma.ExpenseGetPayload<{ include: { paidBy: { select: { id: true; name: true } } } }>[],
  bucket: InsightBucketV1,
): InsightPointV1[] {
  const bucketMap = new Map<string, { totalAmount: number; expenseCount: number }>()

  for (const expense of expenses) {
    const key = bucketStartIso(expense.occurredAt, bucket)
    const current = bucketMap.get(key) ?? { totalAmount: 0, expenseCount: 0 }
    current.totalAmount += expense.amount
    current.expenseCount += 1
    bucketMap.set(key, current)
  }

  return [...bucketMap.entries()]
    .map(([bucketStart, value]) => ({
      bucketStart,
      totalAmount: value.totalAmount,
      expenseCount: value.expenseCount,
    }))
    .sort((a, b) => a.bucketStart.localeCompare(b.bucketStart))
}

function buildTopPayers(
  expenses: Prisma.ExpenseGetPayload<{ include: { paidBy: { select: { id: true; name: true } } } }>[],
): TopPayerInsightV1[] {
  const payerMap = new Map<string, { memberName: string; totalAmount: number }>()

  for (const expense of expenses) {
    const current = payerMap.get(expense.paidBy.id) ?? {
      memberName: expense.paidBy.name,
      totalAmount: 0,
    }
    current.totalAmount += expense.amount
    payerMap.set(expense.paidBy.id, current)
  }

  return [...payerMap.entries()]
    .map(([memberId, summary]) => ({
      memberId,
      memberName: summary.memberName,
      totalAmount: summary.totalAmount,
    }))
    .sort((a, b) => b.totalAmount - a.totalAmount)
}

function bucketStartIso(date: Date, bucket: InsightBucketV1): string {
  const utc = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))

  if (bucket === 'month') {
    return new Date(Date.UTC(utc.getUTCFullYear(), utc.getUTCMonth(), 1)).toISOString()
  }

  if (bucket === 'week') {
    const mondayOffset = (utc.getUTCDay() + 6) % 7
    utc.setUTCDate(utc.getUTCDate() - mondayOffset)
    return utc.toISOString()
  }

  return utc.toISOString()
}
