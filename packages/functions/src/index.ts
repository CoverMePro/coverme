import * as functions from 'firebase-functions';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import authRoutes from './routes/auth';
import teamRoutes from './routes/teams';
import shiftTemplateRoutes from './routes/shift-templates';
import overtimeRoutes from './routes/overtime-callout';
import userRoutes from './routes/users';
import companyRoutes from './routes/company';
import smsRoutes from './routes/sms';
import calloutCyle from './utils/overtime';

const app = express();
app.use(
	cors({
		origin: [
			'https://covermedemo.web.app',
			'http://covermedemo.web.app',
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

app.use('/auth', authRoutes);
app.use('/overtime-callouts', overtimeRoutes);
app.use('/users', userRoutes);
app.use('/teams', teamRoutes);
app.use('/shift-templates', shiftTemplateRoutes);
app.use('/sms', smsRoutes);
app.use('/company', companyRoutes);

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
