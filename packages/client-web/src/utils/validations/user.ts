import { isEmail, isEmpty, isPhone } from './shared';

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

	return errors;
};

export const validateUserEdit = (values: any) => {
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

	if (isEmpty(values.phone)) {
		errors.phone = 'Required';
	} else if (!isPhone(values.phone)) {
		errors.phone = 'Must be a valid Phone Number';
	}

	return errors;
};
