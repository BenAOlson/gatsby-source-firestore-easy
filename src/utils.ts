import firebase from 'firebase'
import { FbCredentials } from './types'

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
