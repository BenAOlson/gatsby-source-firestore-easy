import { firestore } from 'firebase-admin'

/*
  TODO:
  ----
    * Refactor to return new object instead of mutating
    * DRY up code
    * Accept firestore document snapshots as well as objs/whatever?
 */

/**
 * Recursively moves through Firestore document data, searching for
 * timestamps and converting them to JS date objects.
 *
 * @param data Firestore data, already converted to regular JS form
 */
const convertAllTimestamps = (data: unknown) => {
  if (Array.isArray(data)) {
    traverseArray(data)
  } else if (typeof data === 'object' && data !== null) {
    traverseObject(data as { [keyof: string]: unknown })
  }
}

export default convertAllTimestamps

const traverseArray = (arr: unknown[]) => {
  arr.forEach((elem, i) => {
    if (elem instanceof firestore.Timestamp) {
      arr[i] = elem.toDate()
    } else {
      convertAllTimestamps(elem)
    }
  })
}

const traverseObject = (obj: { [keyof: string]: unknown }) => {
  Object.keys(obj).forEach((key) => {
    const value = obj[key]
    if (value instanceof firestore.Timestamp) {
      obj[key] = value.toDate()
    } else {
      convertAllTimestamps(obj[key])
    }
  })
}
