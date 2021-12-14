import { Request, Response } from 'express';

import { IUserLogin, IUserInfo } from '../models/User';
import { validateLogin } from '../utils/validators';

import config from '../config/fb-config';
import { db, fbAdmin } from '../utils/admin';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendSignInLinkToEmail,
} from 'firebase/auth';

// set up firebase app and auth service
const firebaseApp = initializeApp(config);
const firebaseAuth = getAuth(firebaseApp);

const sendRegisterLink = (req: Request, res: Response) => {
  const { email, firstName, lastName, company, role, position } = req.body;
  const actionCodeSettings = {
    // URL you want to redirect back to. The domain (www.example.com) for this
    // URL must be in the authorized domains list in the Firebase Console.
    // TODO: seturl
    url: `http://localhost:5001/coverme-47dc7/us-central1/api/auth/register-callback?email=${email}&firstName=${firstName}&lastName=${lastName}&company=${company}&role=${role}&position=${position}`,
    // This must be true.
    handleCodeInApp: true,
  };

  sendSignInLinkToEmail(firebaseAuth, email, actionCodeSettings)
    .then(() => {
      return res.json({ message: 'Email link successful', email });
    })
    .catch((error) => {
      console.log(error);

      return res.status(500).json({ error });
    });
};

const registerUser = (req: Request, res: Response) => {
  const { email, password, phoneNo } = req.body;

  let token: string;
  createUserWithEmailAndPassword(firebaseAuth, email, password)
    .then((data) => {
      return data.user.getIdToken();
    })
    .then((tokenId) => {
      token = tokenId;

      return db.doc(`/users/${email}`).update({ phoneNo });
    })
    .then(() => {
      return db.doc(`/users/${email}`).get();
    })
    .then((userData) => {
      const userInfo: IUserInfo = {
        data: { ...userData.data() },
        email: userData.id,
      };
      return res.json({
        message: 'User created successfully!',
        user: userInfo,
        token: token,
      });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

const signIn = (req: Request, res: Response) => {
  const userLogin: IUserLogin = req.body;

  const { valid, errors } = validateLogin(userLogin);

  if (!valid) {
    return res.status(400).json(errors);
  }

  let token: string;
  let cookie: string;
  const expiresIn = 60 * 5 * 1000; //60 * 60 * 24 * 1 * 1000;
  return signInWithEmailAndPassword(
    firebaseAuth,
    userLogin.email,
    userLogin.password
  )
    .then((data) => {
      return data.user.getIdToken();
    })
    .then((tokenId) => {
      token = tokenId;

      return fbAdmin.auth().createSessionCookie(tokenId, { expiresIn });

      // retreive user info to send to client
    })
    .then((sessionCookie) => {
      cookie = sessionCookie;

      return db.doc(`/users/${userLogin.email}`).get();
    })
    .then((userData) => {
      const userInfo: IUserInfo = {
        data: { ...userData.data() },
        email: userData.id,
      };

      const cookieOptions = { maxAge: expiresIn, httpOnly: true, secure: true };
      res.cookie('session', cookie, cookieOptions);
      console.log(res);
      return res.json({ message: 'login successful', user: userInfo, token });
    })
    .catch((err) => {
      console.error(err);
      return res
        .status(403)
        .json({ general: 'Wrong credentials, please try again' });
    });
};

const getUser = (req: Request, res: Response) => {
  db.doc(`/users/${req.params.email}`)
    .get()
    .then((userData) => {
      if (userData.exists) {
        const userInfo: IUserInfo = {
          data: { ...userData.data() },
          email: userData.id,
        };
        return res.json(userInfo);
      } else {
        return res.status(404).json({ error: 'User not found' });
      }
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

const checkAuth = (req: Request, res: Response) => {
  if (req.cookies && req.cookies.session) {
    const sessionCookie = `${req.cookies.session}`;

    fbAdmin
      .auth()
      .verifySessionCookie(sessionCookie, true)
      .then((decodedClaims) => {
        if (Date.now() < decodedClaims.exp) {
          console.log('PASSED');
          return res.json({ authenticated: true });
        } else {
          console.log('expired');
          return res.status(401).json({ error: 'Session Expired' });
        }
      })
      .catch((error) => {
        return res.status(401).json({ error });
      });
  }
  return res.status(401).json({ error: 'Session Empty' });
};

const checkUser = (req: Request, res: Response) => {
  db.doc(`/users/${req.params.email}`)
    .get()
    .then((userData) => {
      if (userData.exists) {
        return res.json({ exists: true });
      } else {
        return res.json({ exists: true });
      }
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

const updateUser = (req: Request, res: Response) => {
  let userInfo: IUserInfo = req.body;

  db.doc(`/users/${req.params.userId}`)
    .update(userInfo.data!)
    .then(() => {
      return res.json({ message: 'User updated successfully!' });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

const registerCallback = (req: Request, res: Response) => {
  const { email, firstName, lastName, company, role, position } = req.query;

  db.doc(`/users/${email}`)
    .set({
      firstName,
      lastName,
      company,
      role,
      position,
    })
    .then((result) => {
      res.redirect(`http://localhost:3000/onboard?email=${email}`);
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

const createCompany = async (req: Request, res: Response) => {
  const companyName = req.body.company.name;
  const companyInfo = req.body.company.data;

  const ownerEmail = req.body.owner.email;
  const ownerInfo = req.body.owner.data;

  db.doc(`/companies/${companyName}`)
    .get()
    .then((companyData) => {
      if (companyData.exists) {
        return res
          .status(403)
          .json({ error: 'Company with that name already exists' });
      } else {
        return db
          .doc(`/companies/${companyName}`)
          .set(companyInfo)
          .then(() => {
            const actionCodeSettings = {
              // URL you want to redirect back to. The domain (www.example.com) for this
              // URL must be in the authorized domains list in the Firebase Console.
              // TODO: seturl
              url: `http://localhost:5001/coverme-47dc7/us-central1/api/auth/register-callback?email=${ownerEmail}&firstName=${ownerInfo.firstName}&lastName=${ownerInfo.lastName}&company=${companyName}&role=${ownerInfo.role}&position=Manager`,
              // This must be true.
              handleCodeInApp: true,
            };

            sendSignInLinkToEmail(firebaseAuth, ownerEmail, actionCodeSettings)
              .then(() => {
                return res.status(201).json({
                  message: 'Company Created!',
                });
              })
              .catch((error) => {
                console.log(error);

                return res.status(500).json({ error });
              });
          })
          .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code });
          });
      }
    })
    .then()
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

export default {
  checkAuth,
  sendRegisterLink,
  registerUser,
  signIn,
  getUser,
  checkUser,
  updateUser,
  registerCallback,
  createCompany,
};
