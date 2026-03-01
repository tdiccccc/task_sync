import { date } from 'zod'

export const MIN_DATE = new Date('1900-01-01')
export const MAX_DATE = new Date('9999-12-30')

export const DateSchema = date()
  .min(MIN_DATE)
  .max(MAX_DATE)
  .openapi({ example: '2022-12-31', format: 'date' })
