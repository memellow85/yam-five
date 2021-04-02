<p align="center">
  <img width="100" height="100" src="https://yamfive-app.herokuapp.com/icon.png" />
</p>

# Yam Five

> The scope of the game is created more combinations with five dices for the get more points

<p align="center">
[![CI](https://github.com/memellow85/yam-five/actions/workflows/main.yml/badge.svg?branch=main)](https://github.com/memellow85/yam-five/actions/workflows/main.yml)
</p>

## Requirements

- Firebase Authentication
- Firebase Firestore Database

## Configurations

- Active Authentication by email/password
- Create on Firestore Database two collections
  - First collection with name 'users'
  - Second collection with name 'rooms'
- Create .env file with follow params for configuration Firebase
  - NUXT_ENV_FIREBASE_API_KEY=copy api_key find in setting Firebase
  - NUXT_ENV_FIREBASE_AUTH_DOMAIN=copy auth_domain find in setting Firebase
  - NUXT_ENV_FIREBASE_PROJECT_ID=copy project_id find in setting Firebase
  - NUXT_ENV_FIREBASE_STORAGE_BUCKET=copy storage_bucket find in setting Firebase
  - NUXT_ENV_FIREBASE_MESSAGE_SENDER_ID=copy message_sender_id find in setting Firebase
  - NUXT_ENV_FIREBASE_APP_ID=copy app_id find in setting Firebase

## Usage

- Install dependencies ```yarn install```
- Run application with hot reload at localhost:3000 ```yarn dev```
- Run application for production ```yarn build```

## Examples

See the demo [here](https://yamfive-app.herokuapp.com/)

## Release

1.0.0 - First version of the game

## License

MIT
