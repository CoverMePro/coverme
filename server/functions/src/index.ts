import * as functions from 'firebase-functions';
import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth';
import companyRoutes from './routes/company';

// setup express
const app = express();

// app.use(function(req, res, next) {
//     res.header('Access-Control-Allow-Origin', yourExactHostname);
//     res.header('Access-Control-Allow-Credentials', true);
//     res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//     next();
//   });

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

// routes
app.use('/auth', authRoutes);
app.use('/company', companyRoutes);

exports.api = functions.https.onRequest(app);
