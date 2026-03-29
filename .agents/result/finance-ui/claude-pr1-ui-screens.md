# Task Summary

## Feature

finance-ui — Claude PR-1: Mobile-first UI screens with fixture data

## Pre-read Checklist (Phase B compliance)

- [x] `.agents/workflows/add-feature.md`
- [x] `.agents/result/RULE.md`
- [x] `.agents/skills/create-new-feature/SKILL.md`
- [x] `.agents/skills/ui-page-flow-code/SKILL.md`
- [x] `.agents/skills/edited-table/SKILL.md`

**Rules applied:**
- Feature-Based component structure under `components/finance/`
- shadcn Card + Tooltip + gradient hover pattern per `ui-page-flow-code` skill
- Server Components for pages (data passed as props); Client Components for interactive forms/charts
- Fixture data co-located in `app/(finance)/_fixtures/` — not touching `lib/**` (Codex-owned)
- No API routes created (Claude scope: `app/**` excl. `/api/`)

## Files Changed

### New: `components/ui/` (shadcn primitives)
- `card.tsx`
- `badge.tsx`
- `tooltip.tsx`
- `separator.tsx`
- `skeleton.tsx`
- `tabs.tsx`
- `scroll-area.tsx`
- `table.tsx`
- `select.tsx`
- `sheet.tsx`

### New: `app/(finance)/`
- `layout.tsx` — Finance app layout with MobileHeader + BottomNav + Toaster
- `_fixtures/mock-data.ts` — UI fixture data, provisional types, helper functions
- `dashboard/page.tsx`
- `new-expense/page.tsx`
- `history/page.tsx`
- `members/page.tsx`
- `insights/page.tsx`

### New: `components/finance/`
- `layout/MobileHeader.tsx` — Sticky mobile header with group name + member count
- `layout/BottomNav.tsx` — Fixed bottom navigation (5 tabs, primary "Thêm" button elevated)
- `shared/EmptyState.tsx` — Reusable empty/zero-data placeholder
- `shared/MemberAvatar.tsx` — Colored initials avatar per member
- `dashboard/DashboardClient.tsx` — Net balance hero + summary cards + balance list + recent expenses
- `new-expense/NewExpenseForm.tsx` — Full expense form: title, amount, category, payer, member select, quick split, distribution preview, clipboard share
- `history/ExpenseHistoryClient.tsx` — Search + category filter + grouped-by-date expense list
- `members/MembersClient.tsx` — Per-member balance card with debt arrows + clipboard settle share
- `insights/InsightsClient.tsx` — Bar chart (monthly), Pie chart (category), Stacked bar (category × month) via recharts

## What Was Implemented

- **5 mobile-first screens** reachable at `/dashboard`, `/new-expense`, `/history`, `/members`, `/insights`
- **UI state only** — no server actions, no DB calls. All data from `_fixtures/mock-data.ts`
- **Quick split**: "Chia đều" button calculates per-person share (floor + remainder to first person), shows distribution preview inline
- **Clipboard share**: `Share2Icon` button copies formatted split summary to clipboard via `navigator.clipboard.writeText` + sonner toast feedback
- **Vietnamese UX**: VND formatting via `Intl.NumberFormat('vi-VN')`, Vietnamese labels throughout
- **shadcn skill compliance**: Card gradient hover + shine overlay, TooltipTrigger on summary cards, shadcn Table primitives (not raw HTML)

## Ownership Boundaries Respected

| Area | Owner | Status |
|------|-------|--------|
| `app/(finance)/**` | Claude ✓ | Created |
| `components/finance/**` | Claude ✓ | Created |
| `components/ui/**` | Claude ✓ | Extended |
| `prisma/**` | Codex | Not touched |
| `lib/**` | Codex | Not touched |
| `types/**` | Codex | Not touched |
| `app/api/**` | Codex | Not touched |

## Notes / Risks / Follow-up

1. **Integration (Claude PR-2):** After Codex PR-1 merges (`prisma/`, `lib/`, `types/`, `app/api/`), replace fixture imports with real Codex types + server action calls. `TODO: call Codex server action createExpense()` is marked in `NewExpenseForm.tsx`.
2. **Types migration:** Provisional types in `_fixtures/mock-data.ts` (e.g. `FixtureExpense`, `FixtureMember`) should be replaced by canonical Codex types from `types/finance.ts` once available.
3. **Mock balances:** `mockBalances` are hard-coded summaries. Codex's `BalanceLedger` service will provide these dynamically.
4. **VietQR button:** QR code share (mentioned in Codex track) will be a follow-up UI integration once Codex provides the VietQR payload service.
5. **No auth/PermissionGuard:** This app does not use the existing `PermissionGuard` pattern (which belongs to the other app module). Finance app is a standalone group context.
