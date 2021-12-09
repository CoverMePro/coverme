import * as functions from 'firebase-functions';
import express from 'express';

import authRoutes from './routes/auth';

// setup express
const app = express();

// routes
app.use('/auth', authRoutes);

exports.api = functions.https.onRequest(app);
