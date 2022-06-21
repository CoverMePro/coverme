export interface IUserLogin {
    email: string;
    password: string;
}

export interface IUser {
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    role: string;
    company: string;
    hireDate: Date;
    status: string;
    teams: string[];
    position?: string;
    location?: string;
}

export const mapToUser = (id: string, data: any): IUser => {
    let user: IUser = {
        email: id,
        firstName: data.firstName,
        lastName: data.lastName,
        company: data.company,
        role: data.role,
        hireDate: data.hireDate ? data.hireDate.toDate() : undefined,
        phone: data.phone,
        status: data.status,
        teams: data.teams ? data.teams : [],
    };

    if (data.position) {
        user.position = data.position;
    }

    if (data.location) {
        user.location = data.location;
    }

    return user;
};
