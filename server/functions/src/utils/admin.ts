import admin from 'firebase-admin';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const config = {
    apiKey: `${process.env.FB_API_KEY}`,
    authDomain: `${process.env.FB_AUTH_DOMNAIN}`,
    projectId: `${process.env.FB_PROJECT_ID}`,
    storageBucket: `${process.env.FB_STORAGE_BUCKET}`,
    messagingSenderId: `${process.env.FB_MESSAGE_SENDER_ID}`,
    appId: `${process.env.FB_APP_ID}`,
    measurementId: `${process.env.FB_MEASUREMENT_ID}`,
};

const firebaseApp = initializeApp(config);

export const fbAdmin = admin.initializeApp();
export const fbAuth = getAuth(firebaseApp);
export const db = admin.firestore();

db.settings({ ignoreUndefinedProperties: true });
