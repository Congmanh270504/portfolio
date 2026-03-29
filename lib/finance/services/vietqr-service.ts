import { generateVietQrPayload } from '@/lib/finance/vietqr'
import { GenerateVietQrRequestV1, GenerateVietQrResponseV1 } from '@/types/finance/v1/dto'

export function generateVietQrV1(input: GenerateVietQrRequestV1): GenerateVietQrResponseV1 {
  const payload = generateVietQrPayload(input)
  const qrImageUrl = `https://quickchart.io/qr?size=320&text=${encodeURIComponent(payload)}`

  return {
    payload,
    qrImageUrl,
    amount: input.amount,
    transferNote: input.transferNote,
    bankBin: input.bankBin,
    accountNumber: input.accountNumber,
  }
}
