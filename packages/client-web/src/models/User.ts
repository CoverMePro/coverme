type EmployeeType = 'Full-Time' | 'Part-Time' | 'Temp';

export interface IUser {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    role: string;
    employeeType: EmployeeType;
    company: string;
    teams: string[];
    hireDate?: Date | string;
    lastCalledOut?: any;
    location?: string;
    status?: string;
    reportTo?: string[];
}
