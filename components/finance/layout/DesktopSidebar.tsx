"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  HomeIcon,
  PlusCircleIcon,
  ClockIcon,
  UsersIcon,
  BarChart2Icon,
  WalletCardsIcon,
  type LucideIcon,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

interface NavItem {
  href: string
  label: string
  icon: LucideIcon
}

const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Tổng quan", icon: HomeIcon },
  { href: "/history", label: "Lịch sử", icon: ClockIcon },
  { href: "/members", label: "Thành viên", icon: UsersIcon },
  { href: "/insights", label: "Thống kê", icon: BarChart2Icon },
]

interface DesktopSidebarProps {
  groupName: string
  memberCount: number
}

export function DesktopSidebar({ groupName, memberCount }: DesktopSidebarProps) {
  const pathname = usePathname()

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-primary/10"
    >
      {/* Brand / group header */}
      <SidebarHeader className="px-2 py-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="pointer-events-none select-none"
              tooltip={`${groupName} · ${memberCount} thành viên`}
            >
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/15 ring-1 ring-primary/25 animate-pulse-glow">
                <WalletCardsIcon className="size-4 text-primary" />
              </div>
              <div className="min-w-0 flex flex-col">
                <span className="truncate text-xs font-mono font-semibold text-gradient leading-tight">
                  {groupName}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {memberCount} thành viên
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarSeparator />

      {/* Navigation */}
      <SidebarContent className="px-2 py-2">
        <SidebarMenu>
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href
            return (
              <SidebarMenuItem key={href}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  tooltip={label}
                  className={cn(
                    "transition-all duration-200",
                    isActive && "bg-primary/10 text-primary border border-primary/15 hover:bg-primary/15"
                  )}
                >
                  <Link href={href}>
                    <Icon className={cn("size-4", isActive && "text-primary")} />
                    <span>{label}</span>
                    {isActive && (
                      <span className="ml-auto size-1.5 rounded-full bg-primary shrink-0" />
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarSeparator />

      {/* Add expense CTA */}
      <SidebarFooter className="px-2 py-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip="Thêm chi tiêu"
              className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground font-medium shadow-sm animate-pulse-glow"
            >
              <Link href="/new-expense">
                <PlusCircleIcon className="size-4" />
                <span>Thêm chi tiêu</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
