import { IOwnerFormInfo } from 'models/Validation';

const isEmpty = (value: string) => {
    return !value || value.trim() === '';
};

export const isEmail = (email: string) => {
    const re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
};

const isPhone = (phone: string) => {
    return phone.length === 17 && phone[1] === '1';
};

const minLength = (value: string, length: number) => {
    return value.trim().length > length;
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
    } else if (!minLength(values.password, 7)) {
        errors.password = 'Password must be more than 7 characters';
    }

    if (isEmpty(values.confirmPassword as string)) {
        errors.confirmPassword = 'Required';
    } else if (values.password !== values.confirmPassword) {
        errors.confirmPassword = 'Passwords must match';
    }

    if (isEmpty(values.phoneNo as string)) {
        errors.phoneNo = 'Required';
    } else if (!isPhone(values.phoneNo)) {
        errors.phoneNo = '+1 (xxx) xxx-xxxx';
    }

    return errors;
};

export const validateCompany = (values: {
    companyName: string;
    companyEmail: string;
    companyPhone: string;
}) => {
    let errors: any = {};

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
    } else if (!isPhone(values.companyPhone)) {
        errors.companyPhone = 'Must be valid format +1 (xxx) xxx-xxxx';
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

    if (isEmpty(values.position as string)) {
        errors.position = 'Required';
    }

    return errors;
};

export const validateCreateTeam = (values: any) => {
    let errors: any = {};

    if (isEmpty(values.teamName as string)) {
        errors.teamName = 'Required';
    }

    return errors;
};

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
