import { isEmpty, isPhone, minLength } from './shared';

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
    phone: string;
}) => {
    const errors: any = {};
    if (isEmpty(values.password as string)) {
        errors.password = 'Required';
    } else if (!minLength(values.password, 7)) {
        errors.password = 'Password must be more than 7 characters';
    }

    if (isEmpty(values.confirmPassword as string)) {
        errors.confirmPassword = 'Required';
    } else if (values.password !== values.confirmPassword) {
        errors.confirmPassword = 'Passwords must match';
    }

    if (isEmpty(values.phone as string)) {
        errors.phoneNo = 'Required';
    } else if (!isPhone(values.phone)) {
        errors.phoneNo = '+1 (xxx) xxx-xxxx';
    }

    return errors;
};
