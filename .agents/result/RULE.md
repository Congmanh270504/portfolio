# Result Logging Rule

## Purpose

After completing any task, create or update a summary note inside `E:\portfolio\.agents\result\` so there is a clear record of what the AI agent changed.

## Required Workflow

1. Identify the main page or feature folder affected by the task.
2. Use that page or feature name as the folder name inside `E:\portfolio\.agents\result\`.
3. If the folder does not exist, create it.
4. Create a new Markdown file inside that folder.
5. Name the Markdown file based on the completed work summary.
6. Write a concise summary of what the AI agent completed and what changed.

## Folder Rule

- Root folder: `E:\portfolio\.agents\result\`
- Child folder name: use the page name or main feature folder name
- Example page name: `gia-ban`
- Example result folder: `E:\portfolio\.agents\result\gia-ban\`

## File Naming Rule

Use a short kebab-case summary for the file name.

Examples:

- `update-price-calculation.md`
- `fix-table-filter-logic.md`
- `adjust-form-validation.md`

## Required Markdown Content

Each result file should include:

- Task or feature name
- Files changed
- What the AI agent implemented
- What logic or UI was updated
- Any important notes or follow-up items

## Suggested Template

```md
# Task Summary

## Feature

gia-ban

## Files Changed

- src/app/.../page.tsx
- src/features/.../action.ts

## What Was Done

- Updated pricing logic for the gia-ban page
- Adjusted table behavior and related validation
- Refined server action or UI flow where needed

## Notes

- Mention any follow-up work, assumptions, or risks here
```

## Example

If the AI agent updates logic in the `gia-ban` page:

1. Check whether `E:\portfolio\.agents\result\gia-ban\` exists.
2. If it does not exist, create it.
3. Add a Markdown file such as `update-logic-summary.md`.
4. Write what the AI agent changed in that task.

Example output path:

`E:\portfolio\.agents\result\gia-ban\update-logic-summary.md`

## Rule Priority

This rule should be followed whenever a task is completed and there are code, logic, UI, or configuration changes worth recording.
