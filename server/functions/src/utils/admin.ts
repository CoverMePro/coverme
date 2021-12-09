import admin from 'firebase-admin';

export const fbAdmin = admin.initializeApp();

export const db = admin.firestore();
