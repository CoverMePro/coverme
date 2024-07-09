import { EmployeeType, UserStatus } from '../../types';

export interface IRegisterUser {
	email: string;
	password: string;
	firstName: string;
	lastName: string;
	role: Role;
	phone: string;
	hireDate: Date;
	contactBy: string;
	employeeType: EmployeeType;
}

export interface IUserLogin {
	email: string;
	password: string;
}

export type Role = 'Admin' | 'Manager' | 'Staff';

export interface IUser {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
	phone: string;
	role: Role;
	status: UserStatus;
	employeeType: EmployeeType;
	hireDate: Date;
	contactBy: string;
	hireDateDisplay?: string;
	lastCalledOut?: any;
	teams: string[];
}
