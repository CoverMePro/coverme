export interface ICompany {
    name: string;
    email: string;
    phone: string;
}

export const mapToCompany = (data: any): ICompany => {
    return {
        name: data.name,
        email: data.email,
        phone: data.phone,
    };
};
