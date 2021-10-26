const { initializeApp } = require('firebase/app')
const { getAuth } = require('firebase/auth')
const { getFirestore } = require('firebase/firestore')
const { getAnalytics, logEvent } = require('firebase/analytics')
const { getPerformance, trace } = require('firebase/performance')
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

const app = initializeApp(config)
const db = getFirestore(app)
const auth = getAuth(app)

module.exports = {
  app,
  db,
  auth,
  getPerformance,
  getAnalytics,
  logEvent,
  trace,
}
