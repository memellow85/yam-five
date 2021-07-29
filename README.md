<p align="center">
  <img src="https://yamfive-app.herokuapp.com/icons/icon120.png" />
</p>

# Yam Five

> The scope of the game is created more combinations with five dices for the get more points

## Badge

## Requirements

- Firebase Authentication
- Firebase Firestore Database
- Support websocket

## Configurations

- Active Authentication by email/password
- Create on Firestore Database two collections
  - First collection with name 'users'
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

- 1.0.0 - First version of the game
- 1.0.1 - Add recovery password + bugifx
- 1.0.2 - Refactor style + bugfix
- 1.0.3 - Remove Firebase for manage game rooms and integrate websocket + feature + bugfix
- 1.0.4 - Bugfix
- 1.1.0 - New navigation app and new statistics section

## Next release

- 1.1.1 - Increase performance
- 1.1.2 - New feature (tris, scale with four number)
- 1.1.3 - Section for report a bug/features
- 1.2.0 - Optimize app for desktop

## License

MIT
