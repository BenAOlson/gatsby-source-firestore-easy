import { Where, whereFilterOps, OrderBy, FbCollection } from './types'

const appendQueryOptions = (
  query: FbCollection,
  where: Where[] | Where | undefined,
  orderBy: OrderBy[] | undefined,
  limit: number | undefined
) => {
  let appendedQuery = query

  //This order matters. Must be where -> orderBy -> limit
  appendedQuery = appendWhereFilters(query, where)
  appendedQuery = appendOrderBy(query, orderBy)
  appendedQuery = appendLimit(query, limit)

  return appendedQuery
}

export default appendQueryOptions

const appendLimit = (query: FbCollection, limit: number | undefined) => {
  let appendedQuery = query
  if (limit) {
    appendedQuery = appendedQuery.limit(limit) as any
  }
  return appendedQuery
}

const appendOrderBy = (query: FbCollection, orderBy: OrderBy[] | undefined) => {
  let appendedQuery = query
  if (orderBy) {
    orderBy.forEach((param) => {
      if (typeof param === 'string') {
        appendedQuery = query.orderBy(param) as any
      } else {
        appendedQuery = query.orderBy(...param) as any
      }
    })
  }
  return appendedQuery
}

const appendWhereFilters = (
  query: FbCollection,
  where: Where[] | Where | undefined
) => {
  let appendedQuery = query
  if (where?.length) {
    //Only one 'where' was passed (i.e., no 2d array)
    if (!Array.isArray(where[0])) {
      if (checkWhereFilters(where)) {
        appendedQuery = query.where(...(where as Where)) as any //TODO: fix type
      }
      return appendedQuery
    }

    //Multiple 'where' filters were passed
    where.forEach((whereItem) => {
      if (checkWhereFilters(whereItem)) {
        appendedQuery = query.where(...(whereItem as Where)) as any //TODO: fix type
      }
    })
  }
  return appendedQuery
}

//A little convenience pre-checking, not exhaustive or anything
const checkWhereFilters = (whereItem: unknown[]) => {
  if (whereItem.length !== 3) {
    console.warn(
      "A 'where' entry was passed with an invalid number of elements"
    )
    return false
  } else if (!whereFilterOps.includes(whereItem[1] as any)) {
    console.warn(
      "Second element in one of the supplied 'where' was not a valid Firestore 'where' operator (e.g. '==', '<=' etc.)"
    )
    return false
  }
  return true
}
