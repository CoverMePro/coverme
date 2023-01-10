import { fbAdmin } from './admin';
import { Request, Response, NextFunction } from 'express';

export default async (req: Request, res: Response, next: NextFunction) => {
	if (!req.cookies) {
		return res.status(401).send({ message: 'Unauthorized' });
	}

	if (!req.cookies['__session']) {
		return res.status(401).send({ message: 'Unauthorized' });
	}

	const sessionCookie = `${req.cookies['__session']}`;

	const result = await verifySessionCookie(sessionCookie);

	if (result) {
		return next();
	} else {
		return res.status(401).send({ message: 'Unauthorized' });
	}
};

export const assignSessionCookie = (tokenId: string, expiresIn: number) => {
	return fbAdmin.auth().createSessionCookie(tokenId, { expiresIn });
};

export const verifySessionCookie = (sessionCookie: string) => {
	return fbAdmin.auth().verifySessionCookie(sessionCookie, true);
};
