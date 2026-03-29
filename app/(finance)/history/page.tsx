import { ExpenseHistoryClient } from "@/components/finance/history/ExpenseHistoryClient"
import { fetchExpenseHistory } from "@/app/(finance)/_api/server-data"
import { DEMO_GROUP_ID, DEMO_CURRENT_MEMBER_ID } from "@/app/(finance)/_api/config"

export const metadata = { title: "Lịch sử | Chi tiêu nhóm" }

export default async function HistoryPage() {
  const { data: history, isDemo } = await fetchExpenseHistory(DEMO_GROUP_ID, 50)

  return (
    <div>
      <div className="px-4 pt-4 pb-1">
        <h1 className="text-lg font-bold">Lịch sử chi tiêu</h1>
        <p className="text-xs text-muted-foreground">
          {history.totalCount} khoản chi đã ghi lại
        </p>
      </div>
      <ExpenseHistoryClient
        history={history}
        currentMemberId={DEMO_CURRENT_MEMBER_ID}
        isDemo={isDemo}
      />
    </div>
  )
}
