import { NextRequest, NextResponse } from 'next/server'

import { toErrorResponse } from '@/lib/finance/http'
import { generateVietQrV1 } from '@/lib/finance/services/vietqr-service'
import { generateVietQrRequestSchema } from '@/types/finance/v1/schemas'

export async function POST(request: NextRequest) {
  try {
    const payload = generateVietQrRequestSchema.parse(await request.json())
    const data = generateVietQrV1(payload)

    return NextResponse.json({
      version: 'v1',
      data,
    })
  } catch (error) {
    const failure = toErrorResponse(error)
    return NextResponse.json(failure.body, { status: failure.status })
  }
}
