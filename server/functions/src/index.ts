import * as functions from 'firebase-functions';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import { WEB_CLIENT_DOMAIN, LOCAL_CLIENT_DOMAIN } from './constants';

import authRoutes from './routes/auth';
import companyRoutes from './routes/companies/company';
import overtimeRoutes from './routes/overtime-callout';
import userRoutes from './routes/user';
// import { callout } from './utils/overtime';

const app = express();
app.use(cors({ origin: [WEB_CLIENT_DOMAIN, LOCAL_CLIENT_DOMAIN], credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);

app.use(function (_, res, next) {
    res.setHeader('Cache-Control', 'private');
    next();
});

app.use('/auth', authRoutes);
app.use('/company', companyRoutes);
app.use('/overtime-callout', overtimeRoutes);
app.use('/user', userRoutes);

exports.api = functions.https.onRequest(app);

// exports.scheduledFunctions = functions
//     .runWith({ memory: '2GB' })
//     .pubsub.schedule('* * * * *')
//     .onRun((context) => {
//         callout();
//     });
