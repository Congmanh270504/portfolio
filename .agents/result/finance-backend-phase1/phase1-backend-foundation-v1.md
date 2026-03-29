# Task Summary

## Feature

finance-backend-phase1

## Pre-read Checklist

- [x] `.agents/workflows/add-feature.md`
- [x] `.agents/result/RULE.md`
- [x] `.agents/skills/create-new-feature/SKILL.md`
- [x] `.agents/skills/ui-page-flow-code/SKILL.md`
- [x] `.agents/skills/edited-table/SKILL.md`

## Files Changed

- `package.json`
- `pnpm-lock.yaml`
- `prisma/schema.prisma`
- `lib/prisma.ts`
- `lib/finance/errors.ts`
- `lib/finance/http.ts`
- `lib/finance/ledger.ts`
- `lib/finance/mock-fixtures.ts`
- `lib/finance/split.ts`
- `lib/finance/vietqr.ts`
- `lib/finance/services/expense-service.ts`
- `lib/finance/services/insights-service.ts`
- `lib/finance/services/summary-service.ts`
- `lib/finance/services/vietqr-service.ts`
- `types/finance/v1/dto.ts`
- `types/finance/v1/schemas.ts`
- `app/api/v1/expenses/route.ts`
- `app/api/v1/balances/summary/route.ts`
- `app/api/v1/insights/charts/route.ts`
- `app/api/v1/vietqr/route.ts`
- `app/api/v1/fixtures/route.ts`
- `scripts/seed-finance.ts`

## What Was Implemented

- Set up Prisma 6 + MongoDB domain schema for `Group`, `Member`, `Expense`, `SplitShare`, `Settlement`, `BalanceLedger`.
- Added backend source-of-truth split logic with equal/custom share support and deterministic integer remainder handling.
- Implemented debt ledger netting update flow (including reverse-ledger offset handling) when new expenses are created.
- Added frozen `v1` typed DTO/API contracts in `types/finance/v1/**`.
- Implemented `v1` API routes for:
  - create/list expenses (`/api/v1/expenses`)
  - balance summary (`/api/v1/balances/summary`)
  - chart insights aggregates (`/api/v1/insights/charts`)
  - VietQR payload generation (`/api/v1/vietqr`)
  - mock fixtures for UI integration (`/api/v1/fixtures`)
- Added finance seed script (`scripts/seed-finance.ts`) and package scripts for Prisma + seeding.

## Notes / Risks / Follow-up

- Prisma schema validation and Prisma client generation were run successfully.
- Full project typecheck currently fails due pre-existing unrelated file: `components/finance/layout/BottomNav.tsx` (`primary` property typing issue). Backend files were added without editing UI ownership files.
- Prisma warns that `package.json#prisma.seed` is deprecated in future Prisma major; should migrate to `prisma.config.ts` in a later cleanup PR.
