import { Prisma } from '@prisma/client'
import { ZodError } from 'zod'

import { FinanceError } from '@/lib/finance/errors'
import { ApiErrorV1 } from '@/types/finance/v1/dto'

export function toErrorResponse(error: unknown): {
  status: number
  body: ApiErrorV1
} {
  if (error instanceof ZodError) {
    return {
      status: 400,
      body: {
        version: 'v1',
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid request payload',
          details: error.issues,
        },
      },
    }
  }

  if (error instanceof FinanceError) {
    return {
      status: error.status,
      body: {
        version: 'v1',
        error: {
          code: error.code,
          message: error.message,
          details: error.details,
        },
      },
    }
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return {
      status: 400,
      body: {
        version: 'v1',
        error: {
          code: `PRISMA_${error.code}`,
          message: error.message,
        },
      },
    }
  }

  if (error instanceof Error) {
    return {
      status: 500,
      body: {
        version: 'v1',
        error: {
          code: 'INTERNAL_ERROR',
          message: error.message,
        },
      },
    }
  }

  return {
    status: 500,
    body: {
      version: 'v1',
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'Unexpected error',
      },
    },
  }
}
