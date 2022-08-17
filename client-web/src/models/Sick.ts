import { IShift } from './Shift';
import { StatusType } from './Types';

export interface ISickRequest {
    id?: string;
    requestDate: Date;
    userId: string;
    user: string;
    shiftId: string;
    shift?: IShift;
    status: StatusType;
}

export interface ISickDisplay {
    id: string;
    date: string;
    user: string;
    shift: string;
    status: StatusType;
}
