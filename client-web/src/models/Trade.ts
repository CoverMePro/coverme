import { IShift } from './Shift';

export interface ITradeRequest {
    id?: string;
    proposedDate: Date;
    proposedUser: string;
    proposedShiftId: string;
    proposedShift?: IShift;
    requestedUser: string;
    requestedShiftId: string;
    requestedShift?: IShift;
    status: 'Pending' | 'Approved' | 'Rejected';
    archiveUsers?: string[];
    note?: string;
}

export interface ITradeDisplay {
    id: string;
    date: string;
    tradeWithUser: string;
    receiveShift: string;
    tradingShift: string;
    archiveUsers?: string[];
    status: string;
}
