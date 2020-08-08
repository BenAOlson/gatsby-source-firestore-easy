export type FbCredentials = {
  apiKey: string
  authDomain: string
  databaseURL: string
  projectId: string
  storageBucket: string
  messagingSenderId: string
  appId: string
  measurementId: string
}

export type Timestamp = {
  seconds: number
  nanoseconds: number
}

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

// export type OrderBy = string | [string, 'asc' | 'desc']
export type OrderBy = [string, 'asc' | 'desc' | undefined] | string

export type OptionCollection = {
  collection: string
  type?: string
  whereFilters?: Where | Where[]
  orderBy?: OrderBy[]
  skipTimestampConversion?: boolean
}

export type Options = {
  config: FbCredentials
  collections: OptionCollection[]
}
