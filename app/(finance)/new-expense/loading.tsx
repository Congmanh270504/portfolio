import { Skeleton } from "@/components/ui/skeleton"

export default function NewExpenseLoading() {
  return (
    <div className="space-y-4 px-4 pt-4">
      <div className="space-y-1">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-11 w-full rounded-md" />
      </div>
      <div className="space-y-1">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-11 w-full rounded-md" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Skeleton className="h-11 rounded-md" />
        <Skeleton className="h-11 rounded-md" />
      </div>
      <Skeleton className="h-20 w-full rounded-xl" />
      <Skeleton className="h-11 w-full rounded-md" />
      <Skeleton className="h-12 w-full rounded-md" />
    </div>
  )
}
