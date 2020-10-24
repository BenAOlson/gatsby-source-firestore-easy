import { SourceNodesArgs } from 'gatsby'
import { Options, OptionCollection, FbDoc } from './types'
import admin from 'firebase-admin'
import convertAllTimestamps from './convert-all-timestamps'
import appendQueryOptions from './append-query-options'

export const sourceNodes = async (
  { actions, createContentDigest, reporter }: SourceNodesArgs,
  { collections, adminCredential }: Options
) => {
  const initFirebase = (): admin.app.App | undefined => {
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
      return
    }
  }

  const initializedApp = initFirebase()
  if (!initializedApp) return
  const firestore = initializedApp.firestore()

  const promises = collections.map(
    async ({
      collection,
      type,
      skipTimestampConversion,
      where,
      orderBy,
      limit,
    }) => {
      let query = firestore.collection(collection)
      query = appendQueryOptions(query, where, orderBy, limit)

      const snapshot = await query.get()
      snapshot.docs.forEach((doc: FbDoc) => {
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
  )
  await Promise.all(promises)
  return
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
