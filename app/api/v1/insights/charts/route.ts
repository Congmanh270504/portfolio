import { NextRequest, NextResponse } from 'next/server'

import { toErrorResponse } from '@/lib/finance/http'
import { getInsightsChartsV1 } from '@/lib/finance/services/insights-service'
import { insightsChartsQuerySchema } from '@/types/finance/v1/schemas'

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams
    const query = insightsChartsQuerySchema.parse({
      groupId: params.get('groupId') ?? undefined,
      fromDate: params.get('fromDate') ?? undefined,
      toDate: params.get('toDate') ?? undefined,
      bucket: params.get('bucket') ?? undefined,
    })

    const data = await getInsightsChartsV1(query)

    return NextResponse.json({
      version: 'v1',
      data,
    })
  } catch (error) {
    const failure = toErrorResponse(error)
    return NextResponse.json(failure.body, { status: failure.status })
  }
}
