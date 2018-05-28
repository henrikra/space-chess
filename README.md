# Space Chess

This space themed chess game can be played online with friends. Frontend is done with TypeScript and React. Backend uses Firebase's Firestore and Cloud Functions with TypeScript. Backend repo is [here](https://github.com/henrikra/fire-chess-backend)

[Play game here 🚀 👽](https://henrikra.github.io/space-chess)

![screen shot 2018-05-28 at 23 30 08](https://user-images.githubusercontent.com/12229968/40628706-400a3b40-62cf-11e8-9c9a-a192b282dd59.png)

## Running locally
1. Add `src/env.ts` file with your Firebase config like this:
```js
export default {
  firebase: {
    apiKey: "xxx",
    authDomain: "xxx",
    databaseURL: "xxx",
    messagingSenderId: "xxx",
    projectId: "xxx",
    storageBucket: "xxx",
  }
}
```
2. Install dependencies with `yarn`
3. Start local dev environment with `npm start`
