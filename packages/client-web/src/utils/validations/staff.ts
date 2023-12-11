import { isDate, isEmpty, isPhone } from './shared';

export const validateStaffCreate = (values: any) => {
	let errors: any = {};
	if (isEmpty(values.firstName as string)) {
		errors.firstName = 'Required';
	}

	if (isEmpty(values.lastName as string)) {
		errors.lastName = 'Required';
	}
	if (isEmpty(values.hireDate)) {
		errors.hireDate = 'Required';
	} else if (!isDate(values.hireDate)) {
		errors.hireDate = 'Must be a valid date';
	}

	if (isEmpty(values.phone)) {
		errors.phone = '+1 (xxx) xxx-xxxx';
	} else if (!isPhone(values.phone)) {
		errors.phone = '+1 (xxx) xxx-xxxx';
	}
	return errors;
};
