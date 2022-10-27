export interface IShiftDetail {
    name: string;
    timeHour: number;
    timeMinute: number;
    duration: string;
}

export interface IScheduleShiftDetail {}

export interface IShiftRotation {
    id?: string;
    name: string;
    shifts: {
        monday?: IShiftDetail;
        tuesday?: IShiftDetail;
        wednesday?: IShiftDetail;
        thursday?: IShiftDetail;
        friday?: IShiftDetail;
        saturday?: IShiftDetail;
        sunday?: IShiftDetail;
    };
}

export interface IShiftRotationTransaction {
    id?: string;
    teamId?: string;
    userId?: string;
    userName?: string;
    startDate: Date;
    endDate: Date;
    rotation: IShiftRotation;
}
