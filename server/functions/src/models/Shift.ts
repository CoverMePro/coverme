export interface IShift {
    id?: string;
    name: string;
    userId: string;
    userName: string;
    companyId: string;
    teamId: string;
    startDateTime: Date;
    endDateTime: Date;
}

export interface IShiftTemplate {
    id?: string;
    name: string;
    startTimeHours: number;
    startTimeMinutes: number;
    duration: string;
}

export const mapToShift = (id: string, data: any): IShift => {
    return {
        id: id,
        name: data.name,
        userId: data.userId,
        userName: data.userName,
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
        startTimeHours: data.startTimeHours,
        startTimeMinutes: data.startTimeMinutes,
        duration: data.duration,
    };
};
