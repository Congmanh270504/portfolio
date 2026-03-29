## Plan: Phase 1 - Split App Ownership and Anti-Conflict Workflow

Muc tieu Phase 1 la tao nen tang de 2 agent lam song song ma khong dung nhau: Claude phu trach toan bo UI/UX mobile-first, Codex phu trach backend logic + DB schema + nghiep vu chia tien. Ca hai bat buoc doc skill/rule trong `.agents` truoc khi code, va khi xong task phai ghi result vao `.agents/result`.

**Steps**

1. Phase A - Workspace contract and boundaries
2. Khoa pham vi thu muc theo ownership de tranh conflict:
3. Claude only: `app/**` (tru API route), `components/**`, `components/ui/**`, `styles/**`, `app/globals.css`, i18n text rendering.
4. Codex only: `prisma/**`, `lib/**` (logic/domain/db/services), `types/**`, `app/api/**` hoac server actions, scripts seed/test data.
5. Shared but serialized (khong lam dong thoi): `package.json`, `README.md`, `docs/architecture.md`, `docs/development.md`.
6. Thiet lap quy tac branch/commit de tranh conflict file shared: moi agent lam branch rieng, merge Codex nen tang truoc roi rebase Claude.

7. Phase B - Mandatory pre-read before coding
8. Ca hai agent phai doc truoc cac file sau trong `.agents`:
9. `.agents/workflows/add-feature.md`
10. `.agents/result/RULE.md`
11. `.agents/skills/create-new-feature/SKILL.md`
12. `.agents/skills/ui-page-flow-code/SKILL.md`
13. `.agents/skills/edited-table/SKILL.md` (khi co bang editable)
14. Pre-read check bat buoc ghi trong PR description: liet ke file da doc + ap dung rule nao.

15. Phase C - Task split for Phase 1
16. Claude track (UI-first, no business logic ownership):
17. Thiet ke flow mobile cho cac man: Dashboard, New Expense, History, Members/Balances, Insights.
18. Tao component shadcn theo pattern cua skill UI page + flow code: Card summary, table/list view, tooltip, empty/loading states.
19. Tao man New Expense UX toi gian thao tac: chon nguoi tra, chon thanh vien, nhap so tien, nut chia deu nhanh, preview distribution (UI state only).
20. Tao nut share nhanh theo yeu cau hien tai: copy noi dung chia tien (clipboard UX + toast).
21. Codex track (backend-first, source of truth nghiep vu):
22. Thiet lap Prisma 6 + Mongo va schema domain: Member, Group, Expense, SplitShare, Settlement, BalanceLedger.
23. Xay logic chia deu chuan (lam tron, phan du, cap nhat debt) va ledger ai no ban bao nhieu.
24. Tao endpoint/action cho create expense, list history/filter, summary balances, chart aggregates.
25. Tao service generate VietQR payload (bank account + amount + transfer note), tra du lieu cho UI render QR.

26. Phase D - Integration contract (to avoid touching same code)
27. Contract giua UI va backend bang typed DTO trong `types/**` do Codex tao, Claude chi consume.
28. API contract frozen theo version `v1` trong route/actions de Claude khong bi doi payload giua chung.
29. Mock adapter: Codex cung cap mock JSON fixtures; Claude dung fixtures cho UI trong luc backend chua merge.
30. UI integration only files (`app/**` finance pages) do Claude chinh; backend response mapping helpers (`lib/**`) do Codex chinh.
31. Khong sua truc tiep code cua nhau trong cac folder ownership; thay vao do mo integration ticket.

32. Phase E - Result logging (mandatory)
33. Sau moi task hoan thanh, agent phai ghi summary vao `e:\portfolio\.agents\result\`.
34. Cau truc bat buoc:
35. `e:\portfolio\.agents\result\<feature-name>\<short-kebab-summary>.md`
36. Noi dung bat buoc trong file result:
37. Task/feature name.
38. Files changed.
39. What was implemented (UI/logic/schema).
40. Notes/risks/follow-up.

41. Phase F - Delivery order and merge strategy
42. Merge order de xuat de giam conflict:
43. Codex PR-1: Prisma schema + DB client + domain logic + API/actions + DTO.
44. Claude PR-1: UI screens voi fixture data, khong cham DB schema.
45. Claude PR-2 (sau khi Codex PR-1 merge): bind UI vao API that + xu ly loading/error.
46. Final stabilization PR: docs + smoke tests + result summaries hoan chinh.

**Relevant files**

- `.agents/plan/phase1.md` - file plan dang su dung.
- `.agents/workflows/add-feature.md` - workflow bat buoc doc truoc.
- `.agents/skills/create-new-feature/SKILL.md` - guideline feature/backend/server actions.
- `.agents/skills/ui-page-flow-code/SKILL.md` - guideline UI page flow + shadcn patterns.
- `.agents/skills/edited-table/SKILL.md` - guideline editable table khi can.
- `.agents/result/RULE.md` - rule ghi ket qua.

**Verification**

1. Verify ownership map: khong co file nao bi sua boi ca 2 agent trong cung thoi diem.
2. Verify contract: tat ca response payload cua backend co type trong `types/**` va UI chi consume type do.
3. Verify result logging: moi PR/task co file summary trong `.agents/result/<feature>/`.
4. Verify skills compliance: PR note co checklist pre-read cac skill/rule da neu.

**Decisions**

- Chia viec theo vertical ownership de giam conflict ngay tu dau.
- Freeze API contract theo v1 truoc khi Claude bind du lieu that.
- Result logging la bat buoc cho ca Claude va Codex o moi task.
- Uu tien merge backend foundation truoc, sau do UI integration.

**Further Considerations**

1. Nen them CODEOWNERS cho vung UI/backend de bao ve ownership tu dong khi review.
2. Co the bo sung template PR checklist gom muc "da ghi result file chua" de enforce quy trinh.
3. RULE.md hien co vi du path cu; can cap nhat theo path workspace hien tai de tranh nham lan lau dai.
