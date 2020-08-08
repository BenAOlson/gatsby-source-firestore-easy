// import firebase from 'firebase'
import firebase from 'firebase'
import credentials from './credentials'
import { initApp, dbData } from './utils'
console.log('-----')
console.log('begin')
console.log('-----')

initApp(credentials)

const firestore = firebase.firestore()

const getData = async () => {
  const ref = 'dummyTest'
  const snapshot = await firestore.collection(ref).get()
  snapshot.docs.forEach((doc) => {
    const data = doc.data()
    console.log('before:', data)
    convertAllTimestamps(data)
    console.log('after:', data)
  })
  // console.log(data.data())
}

// getData()

type Timestamp = {
  seconds: number
  nanoseconds: number
}

const checkIsTimestamp = (data: unknown) => {
  if (typeof data === 'object' && data !== null) {
    return Object.keys(data).every(
      (value) => value === 'seconds' || value === 'nanoseconds'
    )
  }
}

const convertTimestamp = (timestamp: Timestamp) =>
  new Date(timestamp.seconds * 1000)

const traverse = (data: unknown) => {
  if (Array.isArray(data)) {
    traverseArray(data)
  } else if (typeof data === 'object' && data !== null) {
    traverseObject(data as { [keyof: string]: unknown })
    // traverseObject(data)
  } else {
    //
  }
}

const traverseArray = (arr: unknown[]) => {
  arr.forEach((elem, i) => {
    if (checkIsTimestamp(elem)) {
      arr[i] = convertTimestamp(elem as Timestamp)
    }
    traverse(elem)
  })
}

const traverseObject = (obj: { [keyof: string]: unknown }) => {
  Object.keys(obj).forEach((key) => {
    if (checkIsTimestamp(obj[key])) {
      obj[key] = convertTimestamp(obj[key] as Timestamp)
    } else {
      traverse(obj[key])
    }
  })
}

const convertAllTimestamps = (data: unknown) => {
  traverse(data)
}

// traverse(dbData)
// console.log(dbData[0].array)
// console.log(dbData)

// console.log(myDumbData)
// traverse(matchData)

// console.log(matchData.boxscore.form[0].team.uid)
// console.log(matchData.news.articles[0].categories[0].uid)
