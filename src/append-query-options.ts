import { Where, whereFilterOps } from './types'

export const appendWhereFilters = (
  query: firebase.firestore.CollectionReference<
    firebase.firestore.DocumentData
  >,
  whereFilters: Where[] | undefined
) => {
  if (whereFilters?.length) {
    let appendedQuery = query
    whereFilters.forEach((where) => {
      //Pre-check options
      if (!Array.isArray(where)) {
        console.warn(
          "'whereFilter' option passed was not an array of arrays of valid 'where' options"
        )
        return
      } else if (where.length !== 3) {
        console.warn("'where' entry passed with invalid number of elements")
        return
      } else if (!whereFilterOps.includes(where[1])) {
        console.warn(
          "Second element in 'where' array was not a valid Firestore 'where' operator"
        )
        return
      }

      //Append 'where'
      console.log(...where)
      appendedQuery = query.where(...where) as any //TODO: fix type
    })
    return appendedQuery
  }
  return query
}
