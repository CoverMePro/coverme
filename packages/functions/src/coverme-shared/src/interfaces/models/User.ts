import { UserStatus } from '../../types';

export interface IUserLogin {
	email: string;
	password: string;
}

export type Role = 'Admin' | 'Manager';

export interface IUser {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
	phone: string;
	role: Role;
	status: UserStatus;
	teams: string[];
}
