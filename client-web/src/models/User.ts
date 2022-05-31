export interface IUser {
    email?: string;
    firstName?: string;
    lastName?: string;
    phoneNo?: string;
    role?: string;
    company?: string;
    vacationHours?: number;
    hireDate?: Date | string;
    overtimeCalloutDate?: Date | string;
    location?: string;
    status?: string;
    position?: string;
    teams?: string[];
}
