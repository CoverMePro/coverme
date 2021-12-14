import { fbAdmin } from '../utils/admin';
import { Request, Response, NextFunction } from 'express';

export default (req: Request, res: Response, next: NextFunction) => {
	console.log('inside here');
	if (req.cookies && req.cookies.session) {
		console.log('test');
		const sessionCookie = `${req.cookies.session}`;

		fbAdmin
			.auth()
			.verifySessionCookie(sessionCookie, true)
			.then(session => {
				if (Date.now() < session.exp) {
					console.log('NEXT');
					next();
				} else {
					console.log('FAI');
					return res.redirect(401, 'http://localhost:3000/login');
				}
			})
			.catch(error => {
				return res.redirect(401, 'http://localhost:3000/login');
			});
	} else {
		return res.redirect(401, 'http://localhost:3000/login');
	}
};

export const assignSessionCookie = (tokenId: string, expiresIn: number) => {
	return fbAdmin.auth().createSessionCookie(tokenId, { expiresIn });
};

export const verifySessionCookie = (sessionCookie: string) => {
	return fbAdmin
		.auth()
		.verifySessionCookie(sessionCookie, true)
		.then(decodedClaims => {
			if (Date.now() < decodedClaims.exp) {
				return true;
			} else {
				return false;
			}
		})
		.catch(() => {
			return false;
		});
};
