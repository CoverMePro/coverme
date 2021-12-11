import { IUserLogin } from '../models/User';

const isEmpty = (value: string) => {
  return value.trim() === '';
};

const isEmail = (email: string) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

export const validateLogin = (userLogin: IUserLogin) => {
  let errors: any = {};

  // email
  if (isEmpty(userLogin.email)) {
    errors.email = 'Must not be empty.';
  } else if (!isEmail(userLogin.email)) {
    errors.email = 'Must be a valid email address';
  }

  if (isEmpty(userLogin.password)) {
    errors.password = 'Must not be empty.';
  }

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
  };
};
