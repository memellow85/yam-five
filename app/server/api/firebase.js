const firebase = require('firebase/app').default
require('firebase/auth')
require('firebase/analytics')
require('firebase/firestore')
require('firebase/performance')
require('dotenv').config()

const config = {
  apiKey: process.env.NUXT_ENV_FIREBASE_API_KEY,
  authDomain: process.env.NUXT_ENV_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NUXT_ENV_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NUXT_ENV_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NUXT_ENV_FIREBASE_MESSAGE_SENDER_ID,
  appId: process.env.NUXT_ENV_FIREBASE_APP_ID,
  measurementId: process.env.NUXT_ENV_FIREBASE_ANALYTICS,
}

if (!firebase.apps.length) {
  firebase.initializeApp(config)
  firebase.firestore().settings({ timestampsInSnapshots: true, merge: true })
}

const analytics = firebase.analytics
const performance = firebase.performance

module.exports = {
  auth: firebase.auth(),
  db: firebase.firestore(),
  utils: firebase.firestore,
  fb: firebase,
  analytics,
  performance,
}
