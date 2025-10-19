// config/firebase.js
const firebaseAdmin = require('firebase-admin');
const path = require('path');
require('dotenv').config();

const serviceAccountPath = process.env.FIREBASE_CREDENTIALS_PATH;
const serviceAccount = require(path.resolve(serviceAccountPath));

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
});

const db = firebaseAdmin.firestore();
const auth = firebaseAdmin.auth();

module.exports = { db, auth };
