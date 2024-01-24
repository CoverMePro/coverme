import { isDate, isEmpty } from './shared';

export const validateOvertimeCallout = (values: any) => {
	console.log(values);
	let errors: any = {};

	if (isEmpty(values.selectedTeam as string)) {
		errors.selectedTeam = 'Required';
	}

	if (isEmpty(values.dateTimeValue.toString())) {
		errors.dateTimeValue = 'Required';
	} else if (!isDate(values.dateTimeValue)) {
		errors.dateTimeValue = 'Must be a valid date';
	}
	if (isEmpty(values.duration)) {
		errors.duration = 'Required';
	}
	return errors;
};
