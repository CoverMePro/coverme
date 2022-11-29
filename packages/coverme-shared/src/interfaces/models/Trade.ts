import { ShiftRequestStatus } from 'types';
import { IShift } from './Shift';

export interface IUserTradeInfo {
    name: string;
    email: string;
}

export interface ITradeRequest {
    id?: string;
    proposedDate: Date;
    proposedUserId: string;
    proposedUser: IUserTradeInfo;
    proposedShiftId: string;
    proposedShift?: IShift;
    requestedUserId: string;
    requestedUser: IUserTradeInfo;
    requestedShiftId: string;
    requestedShift?: IShift;
    status: ShiftRequestStatus;
    archiveUsers?: string[];
    note?: string;
}
