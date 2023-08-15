import * as functions from 'firebase-functions';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import authRoutes from './routes/auth';
import teamRoutes from './routes/teams';
import shiftTemplateRoutes from './routes/shift-templates';
import overtimeRoutes from './routes/overtime-callout';
import userRoutes from './routes/users';
import staffRoutes from './routes/staff';
import smsRoutes from './routes/sms';
import calloutCyle from './utils/overtime';

const app = express();

app.use(
	cors({
		origin: [
			process.env.WEB_CLIENT_DOMAIN!,
			process.env.LOCAL_CLIENT_DOMAIN!,
			'http://localhost:3000',
		],
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

// app.use(function (_, res, next) {
// 	res.setHeader('Access-Control-Allow-Origin', '*');
// 	res.setHeader('Access-Control-Allow-Credentials', 'true');
// 	res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
// 	res.setHeader('Cache-Control', 'private');
// 	next();
// });

app.use('/auth', authRoutes);
app.use('/overtime-callouts', overtimeRoutes);
app.use('/users', userRoutes);
app.use('/staff', staffRoutes);
app.use('/teams', teamRoutes);
app.use('/shift-templates', shiftTemplateRoutes);
app.use('/sms', smsRoutes);

exports.api = functions.https.onRequest(app);

exports.scheduledFunction = functions.pubsub.schedule('* * * * *').onRun((context) => {
	return calloutCyle()
		.then(() => {
			console.log('$$OVERTIME CALLOUT$$: Cycle Complete!');
		})
		.catch((err) => {
			console.error(err);
		});
});
