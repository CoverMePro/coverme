import { IOwnerFormInfo } from 'coverme-shared';
import { isEmail, isEmpty, isPhone } from './shared';

export const validateCompany = (values: {
	companyName: string;
	companyEmail: string;
	companyPhone: string;
}) => {
	let errors: any = {};

	if (isEmpty(values.companyName as string)) {
		errors.companyName = 'Required';
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
