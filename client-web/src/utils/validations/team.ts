import { isEmpty } from './shared';

export const validateCreateTeam = (values: any) => {
    let errors: any = {};

    if (isEmpty(values.teamName as string)) {
        errors.teamName = 'Required';
    }

    return errors;
};
