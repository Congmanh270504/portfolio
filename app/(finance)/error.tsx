"use client"

import * as React from "react"
import { AlertTriangleIcon, RefreshCwIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function FinanceError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 px-4 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-destructive/10">
        <AlertTriangleIcon className="size-8 text-destructive" />
      </div>
      <div className="space-y-1">
        <p className="font-semibold">Có lỗi xảy ra</p>
        <p className="text-sm text-muted-foreground max-w-xs">
          {error.message || "Không thể tải dữ liệu. Vui lòng thử lại."}
        </p>
      </div>
      <Button onClick={reset} variant="outline" className="gap-2">
        <RefreshCwIcon className="size-4" /> Thử lại
      </Button>
    </div>
  )
}
