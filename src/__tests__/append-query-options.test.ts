import appendQueryOptions from '../append-query-options'
import * as firebase from '@firebase/rules-unit-testing'
import * as admin from 'firebase-admin'
import { OrderBy, Where } from '../types'

describe('adds firestore query params to query', () => {
  it('should filter query', async () => {
    const gen = setUpTearDown()
    const colRef = (await gen.next()).value
    if (colRef) {
      const min = 3
      const max = 6

      const whereOption: Where[] = [
        ['val', '>=', min],
        ['val', '<', max],
      ]

      const query = appendQueryOptions(
        colRef,
        whereOption,
        undefined,
        undefined
      )
      const snapshot = await query.get()
      snapshot.docs.forEach((doc) => {
        expect(doc.data().val).toBeGreaterThanOrEqual(min)
        expect(doc.data().val).toBeLessThan(max)
      })
      await gen.next()
    } else {
      throw new Error(getErrorStr(colRef))
    }
  })

  it('should order query', async () => {
    const colSize = 5
    const gen = setUpTearDown(colSize)
    const colRef = (await gen.next()).value
    if (colRef) {
      const orderOption: OrderBy[] = [['val', 'desc']]

      const query = appendQueryOptions(
        colRef,
        undefined,
        orderOption,
        undefined
      )

      const reversedSnapshot = await query.get()
      reversedSnapshot.docs.forEach((doc, i) => {
        expect(doc.data().val).toBe(colSize - 1 - i)
      })
      await gen.next()
    } else {
      throw new Error(getErrorStr(colRef))
    }
  })

  it('should limit query', async () => {
    const gen = setUpTearDown()
    const colRef = (await gen.next()).value
    if (colRef) {
      const limitOption = 2

      const query = appendQueryOptions(
        colRef,
        undefined,
        undefined,
        limitOption
      )

      const snapshot = await query.get()
      expect(snapshot.docs.length).toBe(limitOption)
      await gen.next()
    } else {
      throw new Error(getErrorStr(colRef))
    }
  })
})

async function* setUpTearDown(colSize = 10) {
  //Type seems to be for non-admin firebase sdk, but still works for testing for now
  const app = (firebase.initializeAdminApp({
    projectId: 'test-project',
  }) as unknown) as admin.app.App

  const db = app.firestore()

  const zeroToColSize = Array.from(Array(colSize).keys())
  await Promise.all(
    zeroToColSize.map((val) =>
      db.doc(`${app.name}/${val}`).set({
        val,
      })
    )
  )

  // console.log('starting', (await db.doc(`${app.name}/1`).get()).data())
  yield db.collection(app.name)

  await Promise.all(
    zeroToColSize.map((val) => db.doc(`${app.name}/${val}`).delete())
  )
  await Promise.all(firebase.apps().map((app) => app.delete()))
  // console.log('ending', (await db.doc(`${app.name}/1`).get()).data())
  yield
}

const getErrorStr = (colRef: FirebaseFirestore.CollectionReference | void) =>
  `Something went wrong bootstrapping db. colRef: ${colRef}`
