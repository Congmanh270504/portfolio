# Task Summary

## Feature

finance-ui — Claude PR-2: Bind UI to Codex v1 API + loading/error + VietQR

## Pre-read Checklist (Phase B compliance)

- [x] `.agents/workflows/add-feature.md`
- [x] `.agents/result/RULE.md`
- [x] `.agents/skills/create-new-feature/SKILL.md`
- [x] `.agents/skills/ui-page-flow-code/SKILL.md`
- [x] `.agents/skills/edited-table/SKILL.md`

## Files Changed

### Fixed
- `components/finance/layout/BottomNav.tsx` — resolved TypeScript error: replaced `as const` array with proper `NavItem[]` typed interface (reported by Codex)

### New
- `app/(finance)/_api/config.ts` — `DEMO_GROUP_ID`, `DEMO_CURRENT_MEMBER_ID`, `DEMO_GROUP_NAME` constants
- `app/(finance)/_api/server-data.ts` — typed server-side fetchers wrapping Codex services with graceful fixture fallback
- `app/(finance)/error.tsx` — Next.js error boundary for finance route group
- `app/(finance)/dashboard/loading.tsx`
- `app/(finance)/history/loading.tsx`
- `app/(finance)/members/loading.tsx`
- `app/(finance)/insights/loading.tsx`
- `app/(finance)/new-expense/loading.tsx`
- `components/finance/members/VietQrSheet.tsx` — bottom sheet for VietQR generation via `/api/v1/vietqr`

### Updated
- `components/finance/shared/MemberAvatar.tsx` — decoupled from FixtureMember; now accepts `name: string` + derives initials + color automatically
- `components/finance/dashboard/DashboardClient.tsx` — now consumes `BalancesSummaryResponseV1` + `ExpenseHistoryResponseV1`
- `components/finance/history/ExpenseHistoryClient.tsx` — now consumes `ExpenseHistoryResponseV1`
- `components/finance/members/MembersClient.tsx` — now consumes `BalancesSummaryResponseV1` + integrates `VietQrSheet`
- `components/finance/insights/InsightsClient.tsx` — now consumes `InsightsChartsResponseV1` (trend + topPayers)
- `components/finance/new-expense/NewExpenseForm.tsx` — real `POST /api/v1/expenses` with `CreateExpenseV1Request`; shows ledger update count on success; loading spinner
- `app/(finance)/layout.tsx` — async; fetches member count from real API
- `app/(finance)/dashboard/page.tsx` — `Promise.all([fetchBalancesSummary, fetchExpenseHistory])`
- `app/(finance)/new-expense/page.tsx` — fetches member list from balance summary
- `app/(finance)/history/page.tsx` — fetches `ExpenseHistoryResponseV1`
- `app/(finance)/members/page.tsx` — fetches `BalancesSummaryResponseV1`
- `app/(finance)/insights/page.tsx` — fetches `InsightsChartsResponseV1`

## What Was Implemented

- **Graceful fallback**: `server-data.ts` dynamically imports Codex service functions; catches DB errors and returns `financeV1Fixtures` automatically. All pages render in demo/dev mode without MongoDB.
- **`isDemo` flag**: pages pass `isDemo: true` to client components when fallback is active; components show a yellow amber banner.
- **Real API binding**: `NewExpenseForm` POSTs to `/api/v1/expenses` with Codex's `CreateExpenseV1Request` shape; shows ledger update count after save.
- **VietQR settle**: members screen shows a 🔷 QR button on debts owed to the current user; opens `VietQrSheet` (bottom sheet) that calls `POST /api/v1/vietqr`, displays `qrImageUrl` from `quickchart.io`.
- **All 5 loading.tsx**: Suspense-based skeleton screens for each route.
- **error.tsx**: Client error boundary with "Thử lại" reset button.

## Ownership Boundaries Respected

| Area | Owner | Action |
|------|-------|--------|
| `app/(finance)/**` | Claude ✓ | Updated |
| `components/finance/**` | Claude ✓ | Updated |
| `prisma/**` | Codex | Not touched |
| `lib/**` | Codex | Not touched (only dynamic imported) |
| `types/**` | Codex | Only imported, never edited |
| `app/api/**` | Codex | Only called via fetch, never edited |

## Notes / Risks / Follow-up

1. **Auth**: `DEMO_GROUP_ID` and `DEMO_CURRENT_MEMBER_ID` are hardcoded. When auth ships, replace with session-derived values in `server-data.ts` and page files.
2. **History search in URL**: `ExpenseHistoryClient` currently does client-side filtering only. URL param–based search/filter (per `add-feature.md` guideline) is a follow-up ticket.
3. **VietQR image**: Uses `quickchart.io` (external). For production, consider self-hosted QR renderer or Codex-provided CDN URL.
4. **next/image unoptimized**: VietQR image uses `unoptimized` flag because the QR domain is external and not in `next.config.mjs` allowlist. Codex or config PR can add the hostname.
5. **InsightsClient no category breakdown**: v1 `InsightsChartsResponseV1` has `trend + topPayers`, no per-category data. If Codex adds category to v1 or v2, the InsightsClient can be extended.
