import { DashboardClient } from "@/components/finance/dashboard/DashboardClient"
import { fetchBalancesSummary, fetchExpenseHistory } from "@/app/(finance)/_api/server-data"
import { DEMO_GROUP_ID, DEMO_CURRENT_MEMBER_ID } from "@/app/(finance)/_api/config"

export const metadata = { title: "Tổng quan | Chi tiêu nhóm" }

export default async function DashboardPage() {
  const [summaryResult, historyResult] = await Promise.all([
    fetchBalancesSummary(DEMO_GROUP_ID),
    fetchExpenseHistory(DEMO_GROUP_ID, 5),
  ])

  return (
    <DashboardClient
      summary={summaryResult.data}
      history={historyResult.data}
      currentMemberId={DEMO_CURRENT_MEMBER_ID}
      isDemo={summaryResult.isDemo}
    />
  )
}
