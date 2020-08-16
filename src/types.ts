export type EitherDoc =
  | firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>
  | FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>

export type EitherCollection =
  | FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>
  | firebase.firestore.CollectionReference<firebase.firestore.DocumentData>

export type FbCredentials = {
  apiKey: string
  appId: string
  databaseURL: string
  projectId: string
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
  adminCredential?: { credential: string | Object; databaseURL: string }
  config?: FbCredentials
  collections: OptionCollection[]
}
