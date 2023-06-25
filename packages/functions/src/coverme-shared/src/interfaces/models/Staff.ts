import { StaffType } from '../../types';
export interface IStaff {
	id: string;
	firstName: string;
	lastName: string;
	phone: string;
	employeeType: StaffType;
	hireDate: Date;
	contactBy: String;
	hireDateDisplay?: string;
	lastCalledOut?: any;
}
