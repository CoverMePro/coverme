import { IShift } from './Shift';
import { StatusType } from './Types';

export interface ITradeRequest {
    id?: string;
    proposedDate?: Date;
    proposedUser?: string;
    proposedShiftId?: string;
    proposedShift?: IShift;
    requestedUser?: string;
    requestedShiftId?: string;
    requestedShift?: IShift;
    status?: StatusType;
    note?: string;
}
