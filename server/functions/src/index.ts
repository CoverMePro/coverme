import * as functions from 'firebase-functions';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import authRoutes from './routes/auth';
// import companyRoutes from './routes/companies/company';
import teamRoutes from './routes/teams';
import shiftRoutes from './routes/shifts/shifts';
import shiftTemplateRoutes from './routes/shifts/shift-templates';
import shiftTransactionRoutes from './routes/shifts/shift-transaction';
import tradeRequestRoutes from './routes/requests/trade-request';
import overtimeRoutes from './routes/overtime-callout';
import userRoutes from './routes/users';
import { sendSms } from './utils/sms';
// import { callout } from './utils/overtime';

const app = express();
app.use(
    cors({
        origin: [process.env.WEB_CLIENT_DOMAIN!, process.env.LOCAL_CLIENT_DOMAIN!],
        credentials: true,
    })
);
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
//app.use('/company', companyRoutes);
app.use('/overtime-callouts', overtimeRoutes);
app.use('/users', userRoutes);
app.use('/teams', teamRoutes);
app.use('/shifts', shiftRoutes);
app.use('/shift-templates', shiftTemplateRoutes);
app.use('/shift-transactions', shiftTransactionRoutes);
app.use('/trade-request', tradeRequestRoutes);

app.post('/send-sms', sendSms);

exports.api = functions.https.onRequest(app);

// exports.scheduledFunctions = functions
//     .runWith({ memory: '2GB' })
//     .pubsub.schedule('* * * * *')
//     .onRun((context) => {
//         callout();
//     });
