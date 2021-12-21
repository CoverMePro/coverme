export interface IUserLogin {
	email: string;
	password: string;
}

export interface IUserInfo {
	email?: string;
	data?: {
		firstName?: string;
		lastName?: string;
		phoneNo?: string;
		role?: string;
		position?: string;
		company?: string;
		isOwner?: boolean;
		vacationHours?: number;
		seniorityDate?: Date;
		location?: string;
		status?: string;
	};
}

export interface IUser {
	email: string;
	firstName?: string;
	lastName?: string;
	phoneNo?: string;
	role?: string;
	position?: string;
	company?: string;
	isOwner?: boolean;
	vacationHours?: number;
	seniorityDate?: Date;
	location?: string;
	status?: string;
}
