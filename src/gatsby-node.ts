import { SourceNodesArgs } from 'gatsby'
import { Options } from './types'
import firebase from 'firebase'
import convertAllTimestamps from './convert-all-timestamps'
import appendQueryOptions from './append-query-options'

export const sourceNodes = async (
  { actions, createContentDigest, reporter }: SourceNodesArgs,
  { collections, config }: Options
) => {
  try {
    if (!firebase.apps.length) {
      firebase.initializeApp(config)
    }
  } catch (err) {
    reporter.warn(err)
    return
  }

  const firestore = firebase.firestore()

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

      const completeCol = query
      const snapshot = await completeCol.get()
      snapshot.docs.forEach((doc) => {
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
