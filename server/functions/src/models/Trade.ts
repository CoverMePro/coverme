import { IShift } from './Shift';

export interface ITradeRequest {
    id?: string;
    proposedDate?: Date;
    proposedUser?: string;
    proposedShiftId?: string;
    proposedShift?: IShift;
    requestedUser?: string;
    requestedShiftId?: string;
    requestedShift?: IShift;
    status?:
        | 'Pending Staff Response'
        | 'Staff Rejected'
        | 'Waiting Approval'
        | 'Manager Approved'
        | 'Manager Denied';
    note?: string;
}
