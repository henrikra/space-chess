import * as firebase from "firebase";
import "firebase/firestore";

import env from "./env";

firebase.initializeApp(env.firebase);
const firestoreClient = firebase.firestore();
firestoreClient.settings({ timestampsInSnapshots: true });

export const firestore = firestoreClient;
export const auth = firebase.auth();
