import { Timestamp } from './types'

const convertAllTimestamps = (data: unknown) => {
  traverse(data)
}

export default convertAllTimestamps

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
