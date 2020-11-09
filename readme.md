# `gatsby-source-firestore-easy`

The fastest and easiest way to bring firestore data into Gatsby. Just include the collections you want to use, and optionally filter/order/limit your queries with an api that mirrors the firebase SDK.

*Note: The `config` option from version 0.1 has been deprecated, and support for it will be removed in 1.0.0. Please switch over your configuration to use the new admin credential configuration as outlined in this document.*

- [`gatsby-source-firestore-easy`](#gatsby-source-firestore-easy)
  - [Install](#install)
  - [How to use](#how-to-use)
    - [General Setup](#general-setup)
    - [Options](#options)
      - [`adminCredential`](#admincredential)
        - [`credential`](#credential)
        - [`databaseURL`](#databaseurl)
      - [`collections`](#collections)
        - [Collections Quick Reference](#collections-quick-reference)
        - [Collections Detailed Reference](#collections-detailed-reference)
          - [`collection`](#collection)
          - [`type`](#type)
          - [`where`](#where)
          - [`orderBy`](#orderby)
          - [`limit`](#limit)
          - [`skipTimestampConversion`](#skiptimestampconversion)
  - [Contributing](#contributing)


## Install

`npm i gatsby-source-firestore-easy`

## How to use

### General Setup

Example config:
```javascript
// Include in gatsby-config.js
plugins: [
  {
    resolve: `gatsby-source-firestore-easy`,
    options: {
      adminCredential: {
        credential: process.env.FIREBASE_CREDENTIAL, //See details for this option
        databaseURL: 'YOUR_FIREBASE_DATABASE_URL',
      },
      collections: [
        {
          collection: 'collectionPath',
        },
        {
          collection: 'otherCollection/docName/subcollectionName',
          type: 'OptionalNameForGraphQLToUseInsteadOfTheCollectionName',
        },
        {
          collection: 'thirdCollectionPath',
          where: [
            ['yourFieldName', '>=', 'yourDesiredFilterValue' ],
            ['yourFieldName', '<', 'someOtherValue' ],
          ],
          orderBy: [
            ['date','desc'],
          ],
          limit: 10,
        },
      ]
    },
  },
]
```

### Options

#### `adminCredential`

*WARNING: you **MUST NOT** prefix your admin-related environment variables with 'GATSBY_', or they will be exposed on the client-side, thus exposing your Firebase admin credentials to the public.*

This must be an object with both `credential` and `databaseURL` fields.

##### `credential`
`credential` will be your serviceAccountKey.json as generated created from hitting 'generate new private key' under 'Project settings -> Service accounts' in your Firebase console.

You can either pass the `credential` json data by using `require` to import your serviceAccountKey.json (e.g.: `credential: require(process.env.PATH_TO_YOUR_JSON)`), or by passing the json data as a string (presumably from an environment variable for security purposes). The example config above simulates the string option.

Passing your json as string from an environment variable is particularly useful for deploying to serverless environments like Netlify, Vercel, etc.

If you do use `require` to import your json file, it is strongly suggested (for security purposes) to still use an environment variable for the file path.

##### `databaseURL`
This will be a string with your databaseURL from Firebase. Conveniently, Firebase shows you this string on the same Firebase console screen where you generated your service account key.


#### `collections`
This is an array of objects that you want to source in your Gatsby project. The properties that can/must be used in these objects are defined below.

##### Collections Quick Reference

For convenience, here are all of the available options for the `collections` objects, as discussed in more detail below.

|          option name     |              type              |required|
|--------------------------|--------------------------------|--------|
|`collection`              |`string`                        |yes     |
|`type`                    |`string`                        |no      |
|`where`                   |`[string, string, any][]`       |no      |
|`orderBy`                 |`(string \| [string, string])[]`|no      |
|`limit`                   |`number`                        |no      |
|`skipTimestampConversion` |`boolean`                       |no      |

##### Collections Detailed Reference
###### `collection`
A string with the collection path following the requirements from the firebase SDK for `firestore().collection()`. Can be a top-level collection or a subcollection.

E.g.: `collection: 'collectionName/docName/subcollectionName'`

###### `type`
Name that will be used in GraphQL. If left out, this will default to the collection path string.

E.g.: `type: 'TheNameYouWant'`

###### `where`
Use to filter query mirroring firebase SDK. Must be a 2d array of three values, with each value corresponding to the required parameters of firebase's `where` method. See the firebase documentation for more details on what to pass into the `where` method.

E.g.:
```javascript
where: [
  ['field', '>=', 'value'],
  ['field', '<', 'otherValue']
]
```

###### `orderBy`
Use to order the query results returned from firestore using `collection(YOUR_STR).orderBy(YOUR_ORDERBY_STR)`. Must be an array of either strings or arrays of two strings. A string by itself will be the field to order the result by, using firestore's default direction (ascending or descending). An array of strings should use the field name first, followed by the direction.

E.g.:
```javascript
orderBy: [
  'field',
  ['field', 'desc']
]
```

*Note: This is mostly useful only if you're limiting results returned since you can also order your GraphQL queries.*

###### `limit`
Use to limit the number of results returned using `collection(YOUR_STR).limit(YOUR_LIMIT_NUM)`. Must be a number.

E.g.: `limit: 5`

###### `skipTimestampConversion`
By default, `gatsby-source-firestore-easy` automatically converts all firestore timestamps to date objects so that they will yield a useable format in GraphQL. You very very probably want to use this default functionality. However, if you're very very sure that you do not want the timestamps to be automatically converted, you can disable that feature by setting this option to true.

E.g.:
```javascript
//Don't do this, but you technically can do this.
skipTimestampConversion: true
```

## Contributing

If you'd like to contribute (or otherwise fork and modify to your own needs), you'll need to get a local firestore emulator running on port `8080` to run tests. See firebase documentation for that process.