export interface IShift {
    id?: string;
    name?: string;
    userId?: string;
    companyId?: string;
    teamId?: string;
    startDateTime?: Date;
    endDateTime?: Date;
}

export interface IShiftDefinition {
    id?: string;
    name: string;
    duration: string;
}
