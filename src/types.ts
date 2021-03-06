export const whereFilterOps = [
  '<',
  '<=',
  '==',
  '>=',
  '>',
  'array-contains',
  'in',
  'array-contains-any',
] as const

//TODO: learn how to get this direction from FB type
export type WhereFilterOp = typeof whereFilterOps[number]

export type Where = [string, WhereFilterOp, any]

export type OrderBy = [string, 'asc' | 'desc' | undefined] | string

export type OptionCollection = {
  collection: string
  type?: string
  where?: Where | Where[]
  orderBy?: OrderBy[]
  limit?: number
  skipTimestampConversion?: boolean
}

export type Options = {
  adminCredential?: AdminCredential
  collections: Array<OptionCollection | string>
}

export type AdminCredential = {
  credential: string | Object
  databaseURL: string
}
