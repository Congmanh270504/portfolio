import { NextRequest, NextResponse } from 'next/server'

import { toErrorResponse } from '@/lib/finance/http'
import { getBalancesSummaryV1 } from '@/lib/finance/services/summary-service'
import { balancesSummaryQuerySchema } from '@/types/finance/v1/schemas'

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams
    const query = balancesSummaryQuerySchema.parse({
      groupId: params.get('groupId') ?? undefined,
    })

    const data = await getBalancesSummaryV1(query)

    return NextResponse.json({
      version: 'v1',
      data,
    })
  } catch (error) {
    const failure = toErrorResponse(error)
    return NextResponse.json(failure.body, { status: failure.status })
  }
}
