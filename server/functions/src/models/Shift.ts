export interface IShift {
    id?: string;
    name: string;
    userId: string;
    companyId: string;
    teamId: string;
    startDateTime: Date;
    endDateTime: Date;
}

export interface IShiftTemplate {
    id?: string;
    name: string;
    duration: string;
}

export const mapToShift = (id: string, data: any): IShift => {
    return {
        id: id,
        name: data.name,
        userId: data.userId,
        companyId: data.companyId,
        teamId: data.teamId,
        startDateTime: data.startDateTime.toDate(),
        endDateTime: data.endDateTime.toDate(),
    };
};

export const mapToShiftDefinition = (id: string, data: any): IShiftTemplate => {
    return {
        id: id,
        name: data.name,
        duration: data.duration,
    };
};
