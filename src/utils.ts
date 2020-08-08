import firebase from 'firebase'
import { FbCredentials, Timestamp } from './types'

export const initApp = (credentials: FbCredentials) => {
  try {
    if (!firebase.apps.length) {
      firebase.initializeApp(credentials)
    }
  } catch (err) {
    console.warn(err)
    return
  }
}

export const convertAllTimestamps = (data: unknown) => {
  traverse(data)
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
    } else {
      traverse(elem)
    }
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

export const dbData = [
  {
    boolean: true,
    number: 17,
    map: {
      number: 173,
      string: 'map string',
      timestamp: { seconds: 1597075200, nanoseconds: 0 },
      array: ['map array string', 174, { seconds: 1597075200, nanoseconds: 0 }],
    },
    timestamp: { seconds: 1596902400, nanoseconds: 0 },
    string: 'string',
    array: ['array string', 172, { seconds: 1596988800, nanoseconds: 0 }],
  },
  {
    otherTimestamp: { seconds: 1597334400, nanoseconds: 0 },
    otherArray: ['other array string', { seconds: 1597420800, nanoseconds: 0 }],
    other: 'this is the second one',
  },
]
