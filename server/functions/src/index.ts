import * as functions from 'firebase-functions';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import { WEB_CLIENT_DOMAIN, LOCAL_CLIENT_DOMAIN } from './constants';

import authRoutes from './routes/auth';
import companyRoutes from './routes/companies/company';
import userRoutes from './routes/user';

const app = express();
app.use(cors({ origin: [WEB_CLIENT_DOMAIN, LOCAL_CLIENT_DOMAIN], credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);

app.use(function (req, res, next) {
    res.setHeader('Cache-Control', 'private');
    next();
});

app.use('/auth', authRoutes);
app.use('/company', companyRoutes);
app.use('/user', userRoutes);

exports.api = functions.https.onRequest(app);

exports.scheduledFunctions = functions.pubsub.schedule('every 5 seconds').onRun((context) => {
    console.log('THIS IS RUNNING EVERY 5 SECONDS');
    return null;
});
