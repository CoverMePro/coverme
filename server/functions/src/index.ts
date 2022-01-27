import * as functions from 'firebase-functions';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import { WEB_CLIENT_DOMAIN, LOCAL_CLIENT_DOMAIN } from './constants';

import authRoutes from './routes/auth';
import companyRoutes from './routes/company';
import userRoutes from './routes/user';
import shiftRoutes from './routes/shift';

// setup express
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
    // res.header('Access-Control-Allow-Origin', WEB_CLIENT_DOMAIN);
    // res.header('Access-Control-Allow-Credentials', 'true');
    // res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    // res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Cache-Control', 'private');
    next();
});

// routes
app.use('/auth', authRoutes);
app.use('/company', companyRoutes);
app.use('/user', userRoutes);
app.use('/shift', shiftRoutes);

exports.api = functions.https.onRequest(app);
