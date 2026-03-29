import { FinanceError } from '@/lib/finance/errors'

type GenerateVietQrPayloadInput = {
  bankBin: string
  accountNumber: string
  accountName?: string
  amount: number
  transferNote: string
}

function tlv(tag: string, value: string): string {
  const length = value.length.toString().padStart(2, '0')
  return `${tag}${length}${value}`
}

function crc16Ccitt(input: string): string {
  let crc = 0xffff

  for (let i = 0; i < input.length; i += 1) {
    crc ^= input.charCodeAt(i) << 8

    for (let bit = 0; bit < 8; bit += 1) {
      if ((crc & 0x8000) !== 0) {
        crc = (crc << 1) ^ 0x1021
      } else {
        crc <<= 1
      }

      crc &= 0xffff
    }
  }

  return crc.toString(16).toUpperCase().padStart(4, '0')
}

export function generateVietQrPayload({
  bankBin,
  accountNumber,
  accountName,
  amount,
  transferNote,
}: GenerateVietQrPayloadInput): string {
  if (!/^\d{6}$/.test(bankBin)) {
    throw new FinanceError('bankBin must be a 6-digit bank identifier', {
      status: 400,
      code: 'INVALID_BANK_BIN',
    })
  }

  if (!Number.isInteger(amount) || amount <= 0) {
    throw new FinanceError('amount must be a positive integer', {
      status: 400,
      code: 'INVALID_QR_AMOUNT',
    })
  }

  const normalizedNote = transferNote.trim().slice(0, 60)
  const normalizedName = accountName?.trim().slice(0, 80)

  const merchantAccountInfo = [
    tlv('00', 'A000000727'),
    tlv('01', bankBin),
    tlv('02', accountNumber.trim()),
    tlv('03', 'QRIBFTTA'),
  ].join('')

  const additionalData = tlv('08', normalizedNote)

  const payloadWithoutCrc = [
    tlv('00', '01'),
    tlv('01', '12'),
    tlv('38', merchantAccountInfo),
    tlv('53', '704'),
    tlv('54', String(amount)),
    tlv('58', 'VN'),
    normalizedName ? tlv('59', normalizedName) : '',
    tlv('62', additionalData),
  ].join('')

  const crcInput = `${payloadWithoutCrc}6304`
  const crc = crc16Ccitt(crcInput)

  return `${crcInput}${crc}`
}
