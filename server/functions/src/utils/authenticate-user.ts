import { fbAdmin } from '../utils/admin';
import { Request, Response, NextFunction } from 'express';

export default (req: Request, res: Response, next: NextFunction) => {
	let idToken;
	if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
		idToken = req.headers.authorization.split('Bearer ')[1];
	} else {
		console.error('No token found');
		return res.status(403).json({ error: 'Unauthorized' });
	}

	return fbAdmin
		.auth()
		.verifyIdToken(idToken)
		.then(() => {
			return next();
		})
		.catch(err => {
			console.error('Error while verifying token ', err);
			return res.status(403).json(err);
		});
};
