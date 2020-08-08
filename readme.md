# gatsby-source-firestore-easy

The fastest and easiest way to bring firestore data into Gatsby. Just include the collections you want to use, and optionally filter/order/limit your queries with an api that mirrors the firebase SDK.

*Note: This is a pre-release version. I don't expect to introduce any breaking changes before a full release, but be aware that it is possible that breaking changes may be introduced before version 1.0.0 is released.*
- [gatsby-source-firestore-easy](#gatsby-source-firestore-easy)
  - [Install](#install)
  - [How to use](#how-to-use)
    - [General Setup](#general-setup)
    - [Options](#options)
    - [Option Details](#option-details)
      - [`collection`](#collection)
      - [`type`](#type)
      - [`where`](#where)
      - [`orderBy`](#orderby)
      - [`limit`](#limit)
      - [`skipTimestampConversion`](#skiptimestampconversion)
    - [Exmaple Config With All Options](#exmaple-config-with-all-options)


## Install

`npm i gatsby-source-firestore-easy`

## How to use

### General Setup

**Important:** For the moment, this plugin only supports firestore documents with open read permissions (i.e., `allow read` in your rules for the documents used). Future versions may also support documents that require admin permissions to read.

Basic example config:
```javascript
// Include in gatsby-config.js
plugins: [
  {
    resolve: `gatsby-source-firestore-easy`,
    options: {
      //Your firebase credentials
      config: { 
        apiKey: 'YOUR_FIREBASE_API_KEY',
        appId: 'YOUR_FIREBASE_APP_ID',
        databaseURL: 'YOUR_FIREBASE_DATABASE_URL',
        projectId: 'YOUR_FIREBASE_PROJECT_ID',
      },
      //Array of collections you want to use
      collections: [
        {
          //Collection is the only required field.
          //Use the same string you'd use in 'firestore().collection(YOUR_STR)'
          collection: 'collectionPath',
        },
        {
          //You can also query subcollections just like with the SDK.
          collection: 'otherCollection/docName/subcollectionName',
          //The default name in GraphQL will be the collection path
          //(or in the case of subcollections, the name of the subcollection),
          //but you can supply your own label for GraphQL.
          type: 'OptionalNameForGraphQL', //otherwise would be 'subcollectionName'
        },
      ]
    },
  },
]
```

```
```

### Options


|          option name           |               type              |        required        |
|--------------------------------|---------------------------------|------------------------|
|`collection`                    |`string`                         |yes                     |
|`type`                          |`string`                         |no                      |
|`where`                         |`[string, string, any][]`        |no                      |
|`orderBy`                       |`(string \| [string, string])[]` |no                      |
|`limit`                         |`number`                         |no                      |
|`skipTimestampConversion`       |`boolean`                        |no                      |

### Option Details
#### `collection`
A string with the collection path following the requirements from the firebase SDK for `firestore().collection()`. Can be a top-level collection or a subcollection.

E.g.: `collection: 'collectionName/docName/subcollectionName'`

#### `type`
Name that will be used in GraphQL. If left out, this will default to the collection path string.

E.g.: `type: 'TheNameYouWant'`

#### `where`
Use to filter query mirroring firebase SDK. Must be a 2d array of three strings, with each string corresponding to the required parameters of firebase's `where` method. See the firebase documentation for more details

E.g.:
```javascript
where: [
  ['field', '>=', 'value']
  ['field', '<', 'otherValue']
]
```

#### `orderBy`
Use to order the query results returned from firestore using `collection(YOUR_STR).orderBy(YOUR_ORDERBY_STR)`. Must be an array of either strings or arrays of two strings. A string by itself will be the field to order the result by, using firestore's default direction (ascending or descending). An array of strings should use the field name first, followed by the direction.

E.g.:
```javascript
orderBy: [
  'field',
  ['field', 'desc'],
]
```

*Note: This is mostly useful only if you're limiting results returned since you can also order your GraphQL queries.*

#### `limit`
Use to limit the number of results returned using `collection(YOUR_STR).limit(YOUR_LIMIT_NUM)`. Must be a number.

E.g.: `limit: 5`

#### `skipTimestampConversion`
By default, `gatsby-source-firestore-easy` automatically converts all firestore timestamps to a date object so that they will yield a useable format in GraphQL. You very very probably want to use this default functionality. However, if you're very very sure that you do not want the timestamps to be automatically converted, you can disable that future by setting this option to true.

E.g.:
```javascript
//Don't do this, but you technically can do this.
skipTimestampConversion: true
```

### Exmaple Config With All Options

```javascript
// Include in gatsby-config.js
plugins: [
  {
    resolve: `gatsby-source-firestore-easy`,
    options: {
      config: { 
        apiKey: 'YOUR_FIREBASE_API_KEY',
        appId: 'YOUR_FIREBASE_APP_ID',
        databaseURL: 'YOUR_FIREBASE_DATABASE_URL',
        projectId: 'YOUR_FIREBASE_PROJECT_ID',
      },
      collections: [
        {
          collection: 'collectionName/docName/subcollectionName',
          type: 'YourPreferredname',
          where: [
            ['yourFieldName', '>=', 'yourDesiredFilterValue' ],
            ['yourFieldName', '<', 'someOtherValue' ],
          ],
          orderBy: [
            ['date','desc'],
          ],
          limit: 10,
          //But seriously, don't do this.
          skipTimestampConversion: true,
        },
      ]
    },
  },
]
```