import { NextRequest, NextResponse } from 'next/server'

import { toErrorResponse } from '@/lib/finance/http'
import { createExpenseV1, listExpenseHistoryV1 } from '@/lib/finance/services/expense-service'
import { createExpenseRequestSchema, expenseHistoryQuerySchema } from '@/types/finance/v1/schemas'

export async function POST(request: NextRequest) {
  try {
    const json = await request.json()
    const payload = createExpenseRequestSchema.parse(json)
    const data = await createExpenseV1(payload)

    return NextResponse.json(
      {
        version: 'v1',
        data,
      },
      { status: 201 },
    )
  } catch (error) {
    const failure = toErrorResponse(error)
    return NextResponse.json(failure.body, { status: failure.status })
  }
}

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams
    const rawQuery = {
      groupId: params.get('groupId') ?? undefined,
      memberId: params.get('memberId') ?? undefined,
      search: params.get('search') ?? undefined,
      fromDate: params.get('fromDate') ?? undefined,
      toDate: params.get('toDate') ?? undefined,
      limit: params.get('limit') ?? undefined,
      offset: params.get('offset') ?? undefined,
    }

    const query = expenseHistoryQuerySchema.parse(rawQuery)
    const data = await listExpenseHistoryV1(query)

    return NextResponse.json({
      version: 'v1',
      data,
    })
  } catch (error) {
    const failure = toErrorResponse(error)
    return NextResponse.json(failure.body, { status: failure.status })
  }
}
