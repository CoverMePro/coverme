export interface IUserLogin {
    email: string;
    password: string;
}

export interface IUser {
    email?: string;
    firstName?: string;
    lastName?: string;
    phoneNo?: string;
    role?: string;
    position?: string;
    company?: string;
    vacationHours?: number;
    hireDate?: Date;
    location?: string;
    status?: string;
    teams?: string[];
}
