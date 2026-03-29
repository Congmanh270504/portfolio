"use client"

import * as React from "react"
import Link from "next/link"
import { BellIcon, SettingsIcon, UsersIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface MobileHeaderProps {
  groupName: string
  memberCount: number
  className?: string
}

export function MobileHeader({ groupName, memberCount, className }: MobileHeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 flex h-14 items-center justify-between border-b border-primary/10 glass-strong px-4",
        className
      )}
    >
      <div className="flex items-center gap-2 min-w-0">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/15 ring-1 ring-primary/20 animate-pulse-glow">
          <UsersIcon className="size-4 text-primary" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold leading-tight font-mono text-gradient">{groupName}</p>
          <p className="text-xs text-muted-foreground">{memberCount} thành viên</p>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon-sm" className="rounded-full" asChild>
          <Link href="/members">
            <BellIcon className="size-4" />
            <span className="sr-only">Thông báo</span>
          </Link>
        </Button>
        <Button variant="ghost" size="icon-sm" className="rounded-full">
          <SettingsIcon className="size-4" />
          <span className="sr-only">Cài đặt</span>
        </Button>
      </div>
    </header>
  )
}
