import { Where, whereFilterOps } from './types'

export const appendWhereFilters = (
  query: firebase.firestore.CollectionReference<
    firebase.firestore.DocumentData
  >,
  whereFilters: Where[] | Where | undefined
) => {
  if (whereFilters?.length) {
    let appendedQuery = query

    //Only one whereFilter was passed (i.e., no 2d array)
    if (!Array.isArray(whereFilters[0])) {
      if (checkWhereFilters(whereFilters)) {
        appendedQuery = query.where(...(whereFilters as Where)) as any //TODO: fix type
      }
      return appendedQuery
    }

    //Multiple whereFilter filters were passed
    whereFilters.forEach((where) => {
      if (checkWhereFilters(where)) {
        appendedQuery = query.where(...(where as Where)) as any //TODO: fix type
      }
    })
    return appendedQuery
  }
  return query
}

//A little convenience pre-checking, not exhaustive or anything
const checkWhereFilters = (where: unknown[]) => {
  if (where.length !== 3) {
    console.warn(
      "A 'whereFilter' entry was passed with an invalid number of elements"
    )
    return false
  } else if (!whereFilterOps.includes(where[1] as any)) {
    console.warn(
      "Second element in one of the supplied 'whereFilters' was not a valid Firestore 'where' operator (e.g. '==', '<=' etc.)"
    )
    return false
  }
  return true
}
