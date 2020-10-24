import convertAllTimestamps from '../convert-all-timestamps'
import { firestore } from 'firebase-admin'

describe('converts firestore timestamp objects to JS date obects', () => {
  it('should convert all timestamps to dates', () => {
    const timestamp = firestore.Timestamp.now()
    const data = {
      time: timestamp,
      b: {
        time: timestamp,
      },
      c: [timestamp],
      d: [
        {
          dTwo: [
            {
              time: timestamp,
            },
          ],
        },
      ],
    }

    convertAllTimestamps(data)
    expect(data.time).not.toBeInstanceOf(firestore.Timestamp)
    expect(data.b.time).not.toBeInstanceOf(firestore.Timestamp)
    expect(data.c[0]).not.toBeInstanceOf(firestore.Timestamp)
    expect(data.d[0].dTwo[0].time).not.toBeInstanceOf(firestore.Timestamp)
  })

  it('should NOT change non-timestamps', () => {
    const timestamp = firestore.Timestamp.now()
    const fakeTimestamp = { ...timestamp }
    const data = {
      a: 'a',
      one: 1,
      fakeTime: fakeTimestamp,
      b: [fakeTimestamp],
      c: {
        fakeTime: fakeTimestamp,
      },
    }

    convertAllTimestamps(data)
    expect(data.a).toBe('a')
    expect(data.one).toBe(1)
    expect(data.fakeTime).toEqual(timestamp)
    expect(data.b[0]).toEqual(timestamp)
    expect(data.c.fakeTime).toEqual(timestamp)
  })
})
