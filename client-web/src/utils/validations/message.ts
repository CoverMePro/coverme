import { isEmpty } from './shared';

export const validateCreateMessage = (values: any) => {
    let errors: any = {};

    if (isEmpty(values.messageTitle as string)) {
        errors.messageTitle = 'Required';
    }

    if (isEmpty(values.messageContent as string)) {
        errors.messageContent = 'Required';
    }

    return errors;
};
