import admin from 'firebase-admin';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import config from '../config/fb-config';

const firebaseApp = initializeApp(config);

export const fbAdmin = admin.initializeApp();

export const firebaseAuth = getAuth(firebaseApp);

export const db = admin.firestore();
