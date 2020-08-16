import { Timestamp } from './types'

//TODO: fix types, figure out less breakble way to check if object is a Timestamp

const timestampKeys = ['seconds', 'nanoseconds', '_seconds', '_nanoseconds']

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
    if (checkIsTimestamp(elem)) {
      arr[i] = convertTimestamp(elem as Timestamp)
    } else {
      convertAllTimestamps(elem)
    }
  })
}

const traverseObject = (obj: { [keyof: string]: unknown }) => {
  Object.keys(obj).forEach((key) => {
    if (checkIsTimestamp(obj[key])) {
      obj[key] = convertTimestamp(obj[key] as Timestamp)
    } else {
      convertAllTimestamps(obj[key])
    }
  })
}

const checkIsTimestamp = (data: unknown) => {
  if (typeof data === 'object' && data !== null) {
    return Object.keys(data).every((value) => timestampKeys.includes(value))
  }
}

const convertTimestamp = (timestamp: Timestamp) =>
  new Date(timestamp.seconds * 1000)
