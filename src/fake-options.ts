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
      where: [['number', '>=', 13]],
      orderBy: [['number', 'asc']],
      limit: 1,
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
