"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { ThemeToggle } from "@/components/theme-toggle"
import { ThemeChanger } from "@/components/theme-changer"
import { cn } from "@/lib/utils"

interface DesktopHeaderProps {
  className?: string
}

export function DesktopHeader({ className }: DesktopHeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 flex h-14 shrink-0 items-center gap-2 border-b border-primary/10 glass-strong px-4",
        className
      )}
    >
      <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-colors duration-200 rounded-md" />
      <Separator orientation="vertical" className="h-4 opacity-30" />

      {/* Spacer */}
      <div className="flex-1" />

      {/* Theme controls */}
      <div className="flex items-center gap-1">
        <ThemeToggle />
        <ThemeChanger />
      </div>
    </header>
  )
}
