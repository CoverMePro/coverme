import { Request, Response } from 'express';

import { IUserLogin, IUserInfo } from '../models/User';
import { validateLogin } from '../utils/validators';

import config from '../config/fb-config';
import { db } from '../utils/admin';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  sendSignInLinkToEmail,
} from 'firebase/auth';

// set up firebase app and auth service
const firebaseApp = initializeApp(config);
const firebaseAuth = getAuth(firebaseApp);

const registerUser = (req: Request, res: Response) => {
  const { email, companyId } = req.body;
  const actionCodeSettings = {
    // URL you want to redirect back to. The domain (www.example.com) for this
    // URL must be in the authorized domains list in the Firebase Console.
    // TODO: seturl
    url: `http://localhost:3000/onboard?email=${email}company=${companyId}`,
    // This must be true.
    handleCodeInApp: true,
  };

  const auth = getAuth();
  sendSignInLinkToEmail(auth, email, actionCodeSettings)
    .then(() => {
      return res.json({ message: 'Email link successful', email });
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;

      return res.status(errorCode).json({ error: errorMessage });
    });
};

const signIn = (req: Request, res: Response) => {
  const userLogin: IUserLogin = req.body;

  const { valid, errors } = validateLogin(userLogin);

  if (!valid) {
    return res.status(400).json(errors);
  }

  let token: string;
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

      // retreive user info to send to client
      return db.doc(`/users/${userLogin.email}`).get();
    })
    .then((userData) => {
      const userInfo: IUserInfo = {
        ...userData.data(),
        email: userData.id,
      };

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
  console.log(req.params.email);
  db.doc(`/users/${req.params.email}`)
    .get()
    .then((userData) => {
      if (userData.exists) {
        const userInfo: IUserInfo = {
          ...userData.data(),
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

const updateUser = (req: Request, res: Response) => {
  let userInfo: IUserInfo = req.body;

  db.doc(`/users/${req.params.userId}`)
    .update(userInfo)
    .then(() => {
      return res.json({ message: 'User updated successfully!' });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

export default {
  registerUser,
  signIn,
  getUser,
  updateUser,
};
