import { Toaster } from "sonner";
import { FinanceSidebarWrapper } from "@/components/finance/layout/FinanceSidebarWrapper";
import { CursorGlow } from "@/components/cursor-glow";
import { DEMO_GROUP_NAME } from "@/app/(finance)/_api/config";
import {
  fetchBalancesSummary,
  extractMembersFromSummary,
} from "@/app/(finance)/_api/server-data";
import { DEMO_GROUP_ID } from "@/app/(finance)/_api/config";

export default async function FinanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: summary } = await fetchBalancesSummary(DEMO_GROUP_ID);
  const members = extractMembersFromSummary(summary);

  return (
    <div className="relative min-h-screen bg-background scanlines">
      <CursorGlow />
      {/* Ambient background glow mesh */}
      <div
        className="pointer-events-none fixed inset-0 overflow-hidden"
        aria-hidden
      >
        <div className="absolute -top-48 -right-48 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute top-1/3 -left-32 h-64 w-64 rounded-full bg-primary/4 blur-3xl" />
        <div className="absolute -bottom-48 right-1/4 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <FinanceSidebarWrapper
        groupName={DEMO_GROUP_NAME}
        memberCount={members.length}
      >
        {children}
      </FinanceSidebarWrapper>

      <Toaster position="top-center" richColors />
    </div>
  );
}
