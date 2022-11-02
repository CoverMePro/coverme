import { isDate, isEmail, isEmpty } from './shared';

export const validateUserCreate = (values: any) => {
    let errors: any = {};

    if (isEmpty(values.firstName as string)) {
        errors.firstName = 'Required';
    }

    if (isEmpty(values.lastName as string)) {
        errors.lastName = 'Required';
    }

    if (isEmpty(values.email as string)) {
        errors.email = 'Required';
    } else if (!isEmail(values.email)) {
        errors.email = 'Must be an email address';
    }

    if (isEmpty(values.hireDate)) {
        errors.hireDate = 'Required';
    } else if (!isDate(values.hireDate)) {
        errors.hireDate = 'Must be a valid date';
    }

    return errors;
};
