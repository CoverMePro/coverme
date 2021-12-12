export const isEmpty = (value: string) => {
  return !value || value.trim() === '';
};

export const isEmail = (email: string) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

export const validateLogin = (values: any) => {
  const errors: any = {};
  if (isEmpty(values.email as string)) {
    errors.email = 'Required';
  }

  if (isEmpty(values.email as string)) {
    errors.password = 'Required';
  }

  return errors;
};

export const validateRegister = (values: any) => {
  const errors: any = {};
  if (isEmpty(values.password as string)) {
    errors.password = 'Required';
  }

  if (isEmpty(values.confirmPassword as string)) {
    errors.confrimPassword = 'Required';
  }

  if (values.password !== values.confirmPassword) {
    errors.confirmPassword = 'Passwords must match';
  }

  if (isEmpty(values.phoneNo as string)) {
    errors.phoneNo = 'Required';
  }

  console.log(errors);

  // todo (validate a phone format)

  return errors;
};
