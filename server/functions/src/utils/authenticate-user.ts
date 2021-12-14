import { fbAdmin } from '../utils/admin';
import { Request, Response, NextFunction } from 'express';

export default (req: Request, res: Response, next: NextFunction) => {
  if (req.cookies && req.cookies.session) {
    console.log('test');
    const sessionCookie = `${req.cookies.session}`;

    fbAdmin
      .auth()
      .verifySessionCookie(sessionCookie, true)
      .then((session) => {
        if (Date.now() < session.exp) {
          console.log('NEXT');
          next();
        } else {
          console.log('FAI');
          return res.redirect(401, '/login');
        }
      })
      .catch((error) => {
        return res.redirect(401, '/login');
      });
  } else {
    return res.redirect(401, '/login');
  }
};
