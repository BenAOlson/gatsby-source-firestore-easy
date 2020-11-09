import { Actions, Reporter, SourceNodesArgs } from 'gatsby'
import { Options, AdminCredential, Where, OrderBy } from './types'
import admin from 'firebase-admin'
import convertAllTimestamps from './convert-all-timestamps'
import appendQueryOptions from './append-query-options'

//TODO: include unit tests for sourceNodes
export const sourceNodes = async (
  { actions, createContentDigest, reporter }: SourceNodesArgs,
  { collections, adminCredential }: Options
) => {
  const initializedApp = initFirebase(adminCredential, reporter)
  if (!initializedApp) return
  const firestore = initializedApp.firestore()

  const promises = collections.map(async (collectionOptionsItem) => {
    if (typeof collectionOptionsItem !== 'string') {
      await createNode({
        actions,
        createContentDigest,
        firestore,
        ...collectionOptionsItem,
      })
    } else {
      const collection = collectionOptionsItem
      await createNode({ collection, actions, createContentDigest, firestore })
    }
  })
  await Promise.all(promises)
  return
}

type CreateNodeArgs = {
  collection: string
  actions: Actions
  createContentDigest: (input: string | object) => string
  firestore: FirebaseFirestore.Firestore
  type?: string
  where?: Where | Where[]
  orderBy?: OrderBy[]
  limit?: number
  skipTimestampConversion?: boolean
}
const createNode = async ({
  collection,
  actions,
  createContentDigest,
  firestore,
  type,
  where,
  orderBy,
  limit,
  skipTimestampConversion,
}: CreateNodeArgs) => {
  let query = firestore.collection(collection)
  query = appendQueryOptions(query, where, orderBy, limit)

  const snapshot = await query.get()
  snapshot.docs.forEach((doc: admin.firestore.QueryDocumentSnapshot) => {
    const data = doc.data()
    if (!skipTimestampConversion) convertAllTimestamps(data)
    actions.createNode({
      ...data,
      id: doc.id,
      internal: {
        type: type ?? collection.split('/').slice(-1)[0],
        contentDigest: createContentDigest(data),
      },
    })
    Promise.resolve()
  })
}

const initFirebase = (
  adminCredential: AdminCredential | undefined,
  reporter: Reporter
): admin.app.App | undefined => {
  try {
    if (adminCredential) {
      const credential = admin.credential.cert(
        makeCredentialUsable(adminCredential.credential)
      )
      return admin.initializeApp(
        {
          credential,
          databaseURL: adminCredential.databaseURL,
        },
        'gatsby-source-firestore-easy'
      )
    } else {
      throw new Error(
        'gatsby-source-firestore-easy needs adminCredentials option in order to initialize Firebase'
      )
    }
  } catch (err) {
    reporter.warn(err)
  }
}

const makeCredentialUsable = (credential: unknown): Object => {
  if (typeof credential === 'string') {
    return JSON.parse(credential)
  } else if (typeof credential === 'object' && credential !== null) {
    return credential
  }
  throw new Error(
    `adminCredential needs to be of type 'string | Object', but was passed type '${typeof credential}'`
  )
}
