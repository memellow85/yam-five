import { isProd } from '~/utils'

export const USER_DETAILS = isProd() ? 'users' : 'users_dev'
export const ISSUE_DETAILS = isProd() ? 'messages' : 'messages_dev'
export const ERROR_DETAILS = isProd() ? 'errors' : 'errors_dev'
export const CAMPAIGN_DETAILS = isProd() ? 'campaigns' : 'campaigns_dev'
export const CONFIGURATION_DETAILS = isProd()
  ? 'configurations'
  : 'configurations_dev'

export const WEBHOOK_URL = process.env.NUXT_ENV_SLACK_NOTIFICATION

export const config = {
  apiKey: process.env.NUXT_ENV_FIREBASE_API_KEY,
  authDomain: process.env.NUXT_ENV_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NUXT_ENV_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NUXT_ENV_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NUXT_ENV_FIREBASE_MESSAGE_SENDER_ID,
  appId: process.env.NUXT_ENV_FIREBASE_APP_ID,
  measurementId: process.env.NUXT_ENV_FIREBASE_ANALYTICS,
}
