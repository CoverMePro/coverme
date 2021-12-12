import { IOwnerFormInfo } from 'models/Validation';

export const isEmpty = (value: string) => {
  return !value || value.trim() === '';
};

export const isEmail = (email: string) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

export const validateLogin = (values: { email: string; password: string }) => {
  const errors: any = {};
  if (isEmpty(values.email as string)) {
    errors.email = 'Required';
  }

  if (isEmpty(values.email as string)) {
    errors.password = 'Required';
  }

  return errors;
};

export const validateRegister = (values: {
  password: string;
  confirmPassword: string;
  phoneNo: string;
}) => {
  const errors: any = {};
  if (isEmpty(values.password as string)) {
    errors.password = 'Required';
  }

  if (isEmpty(values.confirmPassword as string)) {
    errors.confrimPassword = 'Required';
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = 'Passwords must match';
  }

  if (isEmpty(values.phoneNo as string)) {
    errors.phoneNo = 'Required';
  }

  // todo (validate a phone format)

  return errors;
};

export const validateCompany = (values: {
  companyName: string;
  companyEmail: string;
  companyPhone: string;
}) => {
  let errors: any = {};
  console.log(values);

  if (isEmpty(values.companyName as string)) {
    errors.password = 'Required';
  }

  if (isEmpty(values.companyEmail as string)) {
    errors.companyEmail = 'Required';
  } else if (!isEmail(values.companyEmail)) {
    errors.companyEmail = 'Must be an email address';
  }

  if (isEmpty(values.companyPhone)) {
    errors.companyPhone = 'Required';
  }

  return errors;
};

export const validateOwner = (values: IOwnerFormInfo) => {
  let errors: any = {};

  if (isEmpty(values.ownerFirstName as string)) {
    errors.ownerFistName = 'Required';
  }

  if (isEmpty(values.ownerLastName as string)) {
    errors.ownerLastName = 'Required';
  }

  if (isEmpty(values.ownerEmail as string)) {
    errors.ownerEmail = 'Required';
  } else if (!isEmail(values.ownerEmail)) {
    errors.ownerEmail = 'Must be an email address';
  }

  return errors;
};
