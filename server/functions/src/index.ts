import * as functions from 'firebase-functions';
import express from 'express';
import cookieParser from 'cookie-parser';
//import cors from 'cors';

import authRoutes from './routes/auth';
import companyRoutes from './routes/company';
import userRoutes from './routes/user';

// setup express
const app = express();
//app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:5001'], credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(
	express.urlencoded({
		extended: true
	})
);

app.use(function (req, res, next) {
	res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
	res.header('Access-Control-Allow-Credentials', 'true');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	res.setHeader('Cache-Control', 'private');
	next();
});

// routes
app.use('/auth', authRoutes);
app.use('/company', companyRoutes);
app.use('/user', userRoutes);

exports.api = functions.https.onRequest(app);
