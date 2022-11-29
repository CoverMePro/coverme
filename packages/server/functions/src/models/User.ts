type EmployeeType = 'Full-Time' | 'Part-Time' | 'Temp';

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
    status: string;
    teams: string[];
    location?: string;
    reportTo?: string[];
}

export const mapToUser = (id: string, data: any): IUser => {
    let user: IUser = {
        id: id,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        company: data.company,
        role: data.role,
        employeeType: data.employeeType,
        hireDate: data.hireDate ? data.hireDate.toDate() : undefined,
        phone: data.phone,
        status: data.status,
        teams: data.teams ? data.teams : [],
    };

    if (data.location) {
        user.location = data.location;
    }

    return user;
};
