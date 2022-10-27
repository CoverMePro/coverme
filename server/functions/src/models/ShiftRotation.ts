interface IShiftDetail {
    name: string;
    timeHour: number;
    timeMinute: number;
    duration: string;
}

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
    teamId: string;
    userId: string;
    userName: string;
    startDate: Date;
    endDate: Date;
    rotation: IShiftRotation;
}

export const mapToShiftRotation = (id: string, data: any): IShiftRotation => {
    return {
        id: id,
        name: data.name,
        shifts: data.shifts,
    };
};
