export interface ICompany {
    name: string;
    email: string;
    phone: string;
}

export const mapToCompany = (id: string, data: any): ICompany => {
    return {
        name: id,
        email: data.email,
        phone: data.phone,
    };
};
