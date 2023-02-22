import { isEmpty } from './shared';

export const validateTradeCreate = (values: any) => {
	let errors: any = {};

	if (isEmpty(values.requestedUserId as string)) {
		errors.requestedUserId = 'Required';
	}

	if (isEmpty(values.proposedShiftId as string)) {
		errors.proposedShiftId = 'Required';
	}

	if (isEmpty(values.requestedShiftId as string)) {
		errors.requestedShiftId = 'Required';
	}

	return errors;
};
