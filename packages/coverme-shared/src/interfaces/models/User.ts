import { EmployeeType, UserStatus } from '../../types';

export interface IUserLogin {
    email: string;
    password: string;
}

export interface IUser {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    role: string;
    employeeType: EmployeeType;
    company: string;
    hireDate: Date;
    status: UserStatus;
    teams: string[];
    hireDateDisplay?: string;
    lastCalledOut?: any;
    reportTo?: string[];
}
