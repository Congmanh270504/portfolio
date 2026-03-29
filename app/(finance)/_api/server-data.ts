/**
 * Server-side data fetching helpers for the finance feature.
 * Owner: Claude (UI track) — lives in app/ scope.
 *
 * Strategy: try real Prisma service → on error fall back to Codex fixtures.
 * This allows the UI to render in demo/dev mode without a live DB connection.
 */

import { financeV1Fixtures } from "@/lib/finance/mock-fixtures"
import type {
  BalancesSummaryResponseV1,
  ExpenseHistoryResponseV1,
  InsightsChartsResponseV1,
} from "@/types/finance/v1/dto"

export async function fetchBalancesSummary(
  groupId: string
): Promise<{ data: BalancesSummaryResponseV1; isDemo: boolean }> {
  try {
    const { getBalancesSummaryV1 } = await import(
      "@/lib/finance/services/summary-service"
    )
    const data = await getBalancesSummaryV1({ groupId })
    return { data, isDemo: false }
  } catch {
    return { data: financeV1Fixtures.balancesSummary, isDemo: true }
  }
}

export async function fetchExpenseHistory(
  groupId: string,
  limit = 20
): Promise<{ data: ExpenseHistoryResponseV1; isDemo: boolean }> {
  try {
    const { listExpenseHistoryV1 } = await import(
      "@/lib/finance/services/expense-service"
    )
    const data = await listExpenseHistoryV1({ groupId, limit })
    return { data, isDemo: false }
  } catch {
    return { data: { ...financeV1Fixtures.expenseHistory, limit }, isDemo: true }
  }
}

export async function fetchInsightsCharts(
  groupId: string
): Promise<{ data: InsightsChartsResponseV1; isDemo: boolean }> {
  try {
    const { getInsightsChartsV1 } = await import(
      "@/lib/finance/services/insights-service"
    )
    const data = await getInsightsChartsV1({ groupId })
    return { data, isDemo: false }
  } catch {
    return { data: financeV1Fixtures.insightsCharts, isDemo: true }
  }
}

/** Extract a deduped member list from any combination of API responses */
export function extractMembersFromSummary(
  summary: BalancesSummaryResponseV1
): Array<{ id: string; name: string }> {
  const map = new Map<string, string>()
  for (const mb of summary.memberBalances) {
    map.set(mb.memberId, mb.memberName)
  }
  for (const le of summary.ledger) {
    map.set(le.fromMemberId, le.fromMemberName)
    map.set(le.toMemberId, le.toMemberName)
  }
  return Array.from(map.entries()).map(([id, name]) => ({ id, name }))
}
