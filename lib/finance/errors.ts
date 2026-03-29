export class FinanceError extends Error {
  status: number
  code: string
  details?: unknown

  constructor(message: string, options?: { status?: number; code?: string; details?: unknown }) {
    super(message)
    this.name = 'FinanceError'
    this.status = options?.status ?? 400
    this.code = options?.code ?? 'FINANCE_ERROR'
    this.details = options?.details
  }
}
