import { isEmpty } from './shared';

export const validateShift = (values: any) => {
    let errors: any = {};

    if (isEmpty(values.shiftName as string)) {
        errors.shiftName = 'Required';
    }

    if (isEmpty(values.shiftDuration as string)) {
        errors.shiftDuration = 'Required';
    }

    if (values.shiftDuration.length !== 4) {
        errors.shiftDuration = 'Must be in format of HH:MM';

        return errors;
    }

    const shift: string = values.shiftDuration;

    const hours = +shift.substring(0, 2);
    const minutes = +shift.substring(2);

    if (minutes > 59) {
        errors.shiftDuration = 'Minutes can not exceed 59';
    }

    if (hours > 12 || (hours === 12 && minutes > 0)) {
        errors.shiftDuration = 'Shift can not exceed 12 hours';
    }

    return errors;
};
