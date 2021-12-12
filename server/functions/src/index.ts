import * as functions from 'firebase-functions';
import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth';
import companyRoutes from './routes/company';

// setup express
const app = express();
app.use(cors());

// routes
app.use('/auth', authRoutes);
app.use('/company', companyRoutes);

exports.api = functions.https.onRequest(app);
