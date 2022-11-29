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

export interface IFullTradeDisplay {
    id: string;
    date: string;
    proposedUser: string;
    proposedUserShiftTrading: string;
    receivingUser: string;
    recivingUserShiftTrading: string;
    archiveUsers?: string[];
}
