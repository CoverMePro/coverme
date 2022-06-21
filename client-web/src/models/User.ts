export interface IUser {
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    role: string;
    company: string;
    teams: string[];
    hireDate?: Date | string;
    lastCalledOut?: any;
    location?: string;
    status?: string;
    position?: string;
}
