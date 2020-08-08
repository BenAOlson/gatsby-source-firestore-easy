import credentials from './credentials'
import { FbCredentials, Options } from './types'

const options: Options = {
  // credential: require('./firebase.json'),
  config: credentials,
  collections: [
    // {
    //   type: 'Sub',
    //   collection: 'dummyTest/dummyDoc/dummySubCollection',
    // },
    {
      // type: 'DummyTest',
      collection: 'dummyTest',
      whereFilters: [
        // 'number',
        // '>',
        // 13,
        ['number', '>=', 13],
        // ['number', '==', 17],
        // ['string', '==', 'string'],
      ],
      // skipTimestampConversion: true,
    },
    // {
    //   type: 'Unavailable Type',
    //   collection: 'unavailable',
    // },
    // {
    //   type: 'FirestoreNews',
    //   collection: 'news',
    // },
  ],
}

export default options
