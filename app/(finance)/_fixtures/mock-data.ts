/**
 * FIXTURE DATA — UI only.
 * Owner: Claude (UI track). Codex will provide real data via types/** + API/actions.
 * Replace calls to these fixtures with real API response types from Codex when backend merges.
 */

// ─── Provisional types (Codex will define canonical versions in types/) ────────

export type MemberColor = "emerald" | "blue" | "violet" | "amber" | "rose"

export interface FixtureMember {
  id: string
  name: string
  initials: string
  color: MemberColor
}

export type ExpenseCategory =
  | "food"
  | "transport"
  | "shopping"
  | "entertainment"
  | "utilities"
  | "other"

export interface FixtureShare {
  memberId: string
  amount: number
  isPaid: boolean
}

export interface FixtureExpense {
  id: string
  title: string
  amount: number
  paidById: string
  date: string
  category: ExpenseCategory
  shares: FixtureShare[]
  note?: string
}

export interface FixtureBalance {
  fromId: string
  toId: string
  amount: number
}

export interface FixtureMonthInsight {
  month: string
  total: number
  food: number
  transport: number
  shopping: number
  entertainment: number
  utilities: number
  other: number
}

// ─── Fixture constants ─────────────────────────────────────────────────────────

/** The "current user" for fixture purposes */
export const CURRENT_USER_ID = "m1"

export const GROUP_NAME = "Nhóm du lịch Đà Lạt"

export const mockMembers: FixtureMember[] = [
  { id: "m1", name: "An Nguyễn", initials: "AN", color: "emerald" },
  { id: "m2", name: "Bình Trần", initials: "BT", color: "blue" },
  { id: "m3", name: "Châu Lê", initials: "CL", color: "violet" },
  { id: "m4", name: "Dũng Phạm", initials: "DP", color: "amber" },
]

export const mockExpenses: FixtureExpense[] = [
  {
    id: "e1",
    title: "Bữa tối nhà hàng",
    amount: 450000,
    paidById: "m1",
    date: "2026-03-27",
    category: "food",
    shares: [
      { memberId: "m1", amount: 112500, isPaid: true },
      { memberId: "m2", amount: 112500, isPaid: false },
      { memberId: "m3", amount: 112500, isPaid: false },
      { memberId: "m4", amount: 112500, isPaid: false },
    ],
  },
  {
    id: "e2",
    title: "Thuê xe máy",
    amount: 320000,
    paidById: "m2",
    date: "2026-03-26",
    category: "transport",
    shares: [
      { memberId: "m1", amount: 80000, isPaid: false },
      { memberId: "m2", amount: 80000, isPaid: true },
      { memberId: "m3", amount: 80000, isPaid: false },
      { memberId: "m4", amount: 80000, isPaid: false },
    ],
  },
  {
    id: "e3",
    title: "Siêu thị đồ ăn sáng",
    amount: 180000,
    paidById: "m3",
    date: "2026-03-26",
    category: "shopping",
    shares: [
      { memberId: "m1", amount: 45000, isPaid: false },
      { memberId: "m2", amount: 45000, isPaid: false },
      { memberId: "m3", amount: 45000, isPaid: true },
      { memberId: "m4", amount: 45000, isPaid: false },
    ],
  },
  {
    id: "e4",
    title: "Vé vào cổng hồ Tuyền Lâm",
    amount: 100000,
    paidById: "m1",
    date: "2026-03-25",
    category: "entertainment",
    shares: [
      { memberId: "m1", amount: 25000, isPaid: true },
      { memberId: "m2", amount: 25000, isPaid: false },
      { memberId: "m3", amount: 25000, isPaid: false },
      { memberId: "m4", amount: 25000, isPaid: false },
    ],
  },
  {
    id: "e5",
    title: "Cà phê Mê Linh",
    amount: 96000,
    paidById: "m4",
    date: "2026-03-25",
    category: "food",
    shares: [
      { memberId: "m1", amount: 24000, isPaid: false },
      { memberId: "m2", amount: 24000, isPaid: false },
      { memberId: "m3", amount: 24000, isPaid: false },
      { memberId: "m4", amount: 24000, isPaid: true },
    ],
  },
  {
    id: "e6",
    title: "Đổ xăng",
    amount: 60000,
    paidById: "m2",
    date: "2026-03-24",
    category: "transport",
    shares: [
      { memberId: "m1", amount: 15000, isPaid: false },
      { memberId: "m2", amount: 15000, isPaid: true },
      { memberId: "m3", amount: 15000, isPaid: false },
      { memberId: "m4", amount: 15000, isPaid: false },
    ],
  },
]

/**
 * Calculated balances: positive = this person owes the current user
 * Negative = current user owes this person
 */
export const mockBalances: FixtureBalance[] = [
  { fromId: "m2", toId: "m1", amount: 137500 }, // Bình nợ An
  { fromId: "m3", toId: "m1", amount: 82500 },  // Châu nợ An
  { fromId: "m1", toId: "m4", amount: 24000 },  // An nợ Dũng
  { fromId: "m3", toId: "m2", amount: 30000 },  // Châu nợ Bình
  { fromId: "m4", toId: "m2", amount: 15000 },  // Dũng nợ Bình
]

export const mockInsights: FixtureMonthInsight[] = [
  { month: "Th11", total: 890000, food: 420000, transport: 150000, shopping: 200000, entertainment: 80000, utilities: 0, other: 40000 },
  { month: "Th12", total: 1250000, food: 580000, transport: 200000, shopping: 320000, entertainment: 100000, utilities: 0, other: 50000 },
  { month: "Th1", total: 760000, food: 310000, transport: 180000, shopping: 150000, entertainment: 60000, utilities: 0, other: 60000 },
  { month: "Th2", total: 540000, food: 240000, transport: 100000, shopping: 120000, entertainment: 50000, utilities: 0, other: 30000 },
  { month: "Th3", total: 1206000, food: 546000, transport: 380000, shopping: 180000, entertainment: 100000, utilities: 0, other: 0 },
]

// ─── Helpers ───────────────────────────────────────────────────────────────────

export function formatVND(amount: number): string {
  return new Intl.NumberFormat("vi-VN").format(amount) + " ₫"
}

export function getMember(id: string): FixtureMember | undefined {
  return mockMembers.find((m) => m.id === id)
}

export function getCategoryLabel(cat: ExpenseCategory): string {
  const labels: Record<ExpenseCategory, string> = {
    food: "Ăn uống",
    transport: "Di chuyển",
    shopping: "Mua sắm",
    entertainment: "Giải trí",
    utilities: "Tiện ích",
    other: "Khác",
  }
  return labels[cat]
}

export function getCategoryEmoji(cat: ExpenseCategory): string {
  const emojis: Record<ExpenseCategory, string> = {
    food: "🍽️",
    transport: "🚗",
    shopping: "🛒",
    entertainment: "🎮",
    utilities: "💡",
    other: "📦",
  }
  return emojis[cat]
}

/** Net balance for the current user (+= owed to me, -= I owe) */
export function getMyNetBalance(): number {
  let net = 0
  for (const b of mockBalances) {
    if (b.toId === CURRENT_USER_ID) net += b.amount
    if (b.fromId === CURRENT_USER_ID) net -= b.amount
  }
  return net
}

/** Total group spending */
export function getTotalSpending(): number {
  return mockExpenses.reduce((sum, e) => sum + e.amount, 0)
}
