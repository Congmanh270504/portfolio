import { InsightsClient } from "@/components/finance/insights/InsightsClient"
import { fetchInsightsCharts } from "@/app/(finance)/_api/server-data"
import { DEMO_GROUP_ID } from "@/app/(finance)/_api/config"

export const metadata = { title: "Thống kê | Chi tiêu nhóm" }

export default async function InsightsPage() {
  const { data: charts, isDemo } = await fetchInsightsCharts(DEMO_GROUP_ID)

  return (
    <div>
      <div className="px-4 pt-4 pb-1">
        <h1 className="text-lg font-bold">Thống kê</h1>
        <p className="text-xs text-muted-foreground">Phân tích chi tiêu theo thời gian</p>
      </div>
      <InsightsClient charts={charts} isDemo={isDemo} />
    </div>
  )
}
