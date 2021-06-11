const firebase = require('firebase/app')
require('firebase/auth')
require('firebase/firestore')
require('dotenv').config()

const config = {
  apiKey: process.env.NUXT_ENV_FIREBASE_API_KEY,
  authDomain: process.env.NUXT_ENV_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NUXT_ENV_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NUXT_ENV_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NUXT_ENV_FIREBASE_MESSAGE_SENDER_ID,
  appId: process.env.NUXT_ENV_FIREBASE_APP_ID,
}

const fb = firebase.default

// eslint-disable-next-line no-unused-expressions
if (!fb.apps.length) {
  fb.initializeApp(config)
  fb.firestore().settings({ timestampsInSnapshots: true })
}

module.exports = {
  auth: fb.auth(),
  db: fb.firestore(),
  utils: fb.firestore,
  fb,
}
