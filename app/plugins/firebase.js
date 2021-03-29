import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

const config = {
  apiKey: process.env.NUXT_ENV_FIREBASE_API_KEY,
  authDomain: process.env.NUXT_ENV_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NUXT_ENV_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NUXT_ENV_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NUXT_ENV_FIREBASE_MESSAGE_SENDER_ID,
  appId: process.env.NUXT_ENV_FIREBASE_APP_ID,
}

// eslint-disable-next-line no-unused-expressions
if (!firebase.apps.length) {
  firebase.initializeApp(config)
  firebase.firestore().settings({ timestampsInSnapshots: true })
}

export const auth = firebase.auth()
export const db = firebase.firestore()
export const utils = firebase.firestore
export default firebase
