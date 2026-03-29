"use client";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { DesktopSidebar } from "@/components/finance/layout/DesktopSidebar";
import { DesktopHeader } from "@/components/finance/layout/DesktopHeader";
import { MobileHeader } from "@/components/finance/layout/MobileHeader";
import { BottomNav } from "@/components/finance/layout/BottomNav";

interface FinanceSidebarWrapperProps {
  groupName: string;
  memberCount: number;
  children: React.ReactNode;
}

export function FinanceSidebarWrapper({
  groupName,
  memberCount,
  children,
}: FinanceSidebarWrapperProps) {
  return (
    <SidebarProvider>
      <DesktopSidebar groupName={groupName} memberCount={memberCount} />

      <SidebarInset className="flex flex-col">
        {/* Desktop header with sidebar toggle + theme controls — hidden on mobile */}
        <DesktopHeader className="hidden md:flex" />

        {/* Mobile header — hidden on desktop */}
        <div className="md:hidden">
          <MobileHeader groupName={groupName} memberCount={memberCount} />
        </div>

        {/* Scrollable content area */}
        <div className="relative flex-1 overflow-y-auto pb-16 md:pb-6 md:pt-2">
          <div className="md:max-w-7xl md:mx-auto">{children}</div>
        </div>

        {/* Mobile bottom nav — hidden on desktop */}
        <div className="md:hidden">
          <BottomNav />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
