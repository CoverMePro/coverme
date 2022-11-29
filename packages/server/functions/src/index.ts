import * as functions from 'firebase-functions';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import authRoutes from './routes/auth';
import teamRoutes from './routes/teams';
import shiftRoutes from './routes/shifts/shifts';
import shiftTemplateRoutes from './routes/shifts/shift-templates';
import shiftRotationRoutes from './routes/shifts/shift-rotations';
import shiftTransactionRoutes from './routes/shifts/shift-transaction';
import tradeRequestRoutes from './routes/requests/trade-requests';
import timeOffRoutes from './routes/requests/time-off-requests';
import sickRequestRoutes from './routes/requests/sick-requests';
import overtimeRoutes from './routes/overtime-callout';
import messageRoutes from './routes/messages';
import notificationRoutes from './routes/notifications';
import userRoutes from './routes/users';
import { sendSms } from './utils/sms';
import { sendPushNotification, testNot } from './utils/notifications';
import { INotification, mapToNotification } from './models/Notification';
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
app.use('/overtime-callouts', overtimeRoutes);
app.use('/users', userRoutes);
app.use('/teams', teamRoutes);
app.use('/shifts', shiftRoutes);
app.use('/shift-templates', shiftTemplateRoutes);
app.use('/shift-rotations', shiftRotationRoutes);
app.use('/shift-transactions', shiftTransactionRoutes);
app.use('/trade-request', tradeRequestRoutes);
app.use('/time-off', timeOffRoutes);
app.use('/sick-requests', sickRequestRoutes);
app.use('/messages', messageRoutes);
app.use('/notifications', notificationRoutes);

app.post('/send-sms', sendSms);
app.post('/test-not', testNot);

exports.api = functions.https.onRequest(app);

exports.createNot = functions.firestore
    .document('notifications/{notId}')
    .onCreate((snap, context) => {
        console.log('NOTIFICATION');
        const notification: INotification = mapToNotification(snap.id, snap.data());

        sendPushNotification(notification);

        return true;
    });

// exports.scheduledFunctions = functions
//     .runWith({ memory: '2GB' })
//     .pubsub.schedule('* * * * *')
//     .onRun((context) => {
//         callout();
//     });
