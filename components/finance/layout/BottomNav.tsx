"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  HomeIcon,
  PlusCircleIcon,
  ClockIcon,
  UsersIcon,
  BarChart2Icon,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  href: string
  label: string
  icon: LucideIcon
  primary?: boolean
}

const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Tổng quan", icon: HomeIcon },
  { href: "/history", label: "Lịch sử", icon: ClockIcon },
  { href: "/new-expense", label: "Thêm", icon: PlusCircleIcon, primary: true },
  { href: "/members", label: "Thành viên", icon: UsersIcon },
  { href: "/insights", label: "Thống kê", icon: BarChart2Icon },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 flex h-16 items-stretch border-t border-primary/10 glass-strong safe-area-inset-bottom">
      {NAV_ITEMS.map(({ href, label, icon: Icon, primary }) => {
        const isActive = pathname === href
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex flex-1 flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-all duration-200",
              primary
                ? "relative"
                : isActive
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {primary ? (
              <span
                className={cn(
                  "-mt-5 flex size-12 items-center justify-center rounded-full shadow-lg transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground scale-110 shadow-[0_0_20px_4px_var(--glow-color)]"
                    : "bg-primary text-primary-foreground hover:scale-105 hover:shadow-[0_0_16px_2px_var(--glow-color)]"
                )}
              >
                <Icon className="size-5" />
              </span>
            ) : (
              <Icon
                className={cn(
                  "size-5 transition-transform",
                  isActive && "scale-110"
                )}
              />
            )}
            <span className={primary ? "text-primary font-semibold" : ""}>{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
