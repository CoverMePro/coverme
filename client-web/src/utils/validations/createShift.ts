import { isEmpty } from './shared';

export const validateCreateScheduleShift = (values: any) => {
    let errors: any = {};

    if (isEmpty(values.selectedTeam as string)) {
        errors.selectedTeam = 'Required';
    }

    if (isEmpty(values.selectedUser as string)) {
        errors.selectedUser = 'Required';
    }

    return errors;
};

export const validateCreateRotation = (values: any) => {
    let errors: any = {};

    if (isEmpty(values.shiftName as string)) {
        errors.shiftName = 'Required';
    }
    return errors;
};
