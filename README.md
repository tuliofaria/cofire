# Cofire
Firebase bindings to React. Just cofire a component and it's all set.

Using NPM:
```
npm install cofire 
```
Using Yarn:
```
yarn add cofire
```

## Using...

Wrap your components with cofire/Provider, after this all your nested components will have access to Firebase.

`index.js`

```js
import React, { Component } from 'react'
import { Provider } from 'cofire'

// firebase settings
const config = {
  apiKey: "<API_KEY>",
  authDomain: "<AUTH_DOMAIN>",
  databaseURL: "<DATABASE_URL>",
  projectId: "<PROJECT_ID>",
  storageBucket: "<STORAGE_BUCKET>",
  messagingSenderId: "<MESSAGING_SENDER_ID>"
}

ReactDOM.render(
  <Provider firebase={config}>
    <App />
  </Provider>, document.getElementById('root'));

```

On the component that you want to grab data from Firebase, connect your component with cofire HOC.

MyComponent.js
```js
import React from 'react'
import { cofire } from 'cofire'
import { Link } from 'react-router-dom'

const Outro = ({ auth, data, saveDoc }) => {
  return (
    <div>
      <ul>
        { data && !data.isLoading && data.data.map( item => <li key={item.id}>{item.id} . {item.name}</li>) }
      </ul>
      <button onClick={async() => await saveDoc({ name: 'Tulio '+new Date().getTime(), email: 'tuliofaria@gmail.com' })}>Save new document to Firestore</button>
    </div>
  )
}



export default cofire( props => {
  let email = 'tuliofaria@gmail.com'
  if(props.match.params.email){
    email = props.match.params.email
  }
  return {
    data: {
      collection: 'users',
      where: [
        {
          alias: 'email',
          field: 'email', 
          op: '==', 
          value: email
        }
      ]
    }
  }
}, ({ firestore }) => {
  return {
    saveDoc: async doc => await firestore.collection('users').add(doc)
  }
})(MyComponent)

```