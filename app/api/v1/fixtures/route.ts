import { NextResponse } from 'next/server'

import { financeV1Fixtures } from '@/lib/finance/mock-fixtures'

export async function GET() {
  return NextResponse.json({
    version: 'v1',
    data: financeV1Fixtures,
  })
}
