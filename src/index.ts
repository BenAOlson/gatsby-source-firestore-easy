// import firebase from 'firebase'
import firebase from 'firebase'
import { initApp, dbData, convertAllTimestamps } from './utils'
import options from './fake-options'
import appendQueryOptions from './append-query-options'
console.log('-----')
console.log('begin')
console.log('-----')

const { collections, config } = options

initApp(config)

const firestore = firebase.firestore()

const addFakeNodes = async () => {
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

      console.log('completed')
      const completeCol = query //.where('number', '==', 17)
      const snapshot = await completeCol.get()
      snapshot.docs.forEach((doc) => {
        const data = doc.data()
        if (!skipTimestampConversion) convertAllTimestamps(data)
        const fakeNode = {
          ...data,
          id: doc.id,
          internal: {
            type: type ?? collection,
            // contentDigest: createContentDigest(data),
          },
        }
        console.log('fakeNode:', fakeNode)
        Promise.resolve()
      })
    }
  )
  await Promise.all(promises)
  return
}

// addFakeNodes()
