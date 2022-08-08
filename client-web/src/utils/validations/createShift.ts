import { isDate, isEmpty } from './shared';

export const validateCreateShift = (values: any) => {
    let errors: any = {};

    if (isEmpty(values.shiftName as string)) {
        errors.shiftName = 'Required';
    }

    if (isEmpty(values.selectedTeam as string)) {
        errors.selectedTeam = 'Required';
    }

    if (isEmpty(values.selectedUser as string)) {
        errors.selectedUser = 'Required';
    }

    if (isEmpty(values.startDate)) {
        errors.startDate = 'Required';
    } else if (!isDate(values.startDate)) {
        errors.startDate = 'Must be a valid date';
    }

    if (isEmpty(values.shiftDuration as string)) {
        errors.shiftDuration = 'Required';
    } else if (values.shiftDuration.length !== 4) {
        errors.shiftDuration = 'Must be in format of HH:MM';
    }

    return errors;
};
