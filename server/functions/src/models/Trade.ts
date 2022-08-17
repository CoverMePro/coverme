import { IShift } from './Shift';
import { StatusType } from './Types';

export interface IUserTradeInfo {
    name: string;
    email: string;
}

export interface ITradeRequest {
    id?: string;
    proposedDate: Date;
    proposedUser: IUserTradeInfo;
    proposedUserId: string;
    proposedShiftId: string;
    proposedShift?: IShift;
    requestedUser: IUserTradeInfo;
    requestedUserId: string;
    requestedShiftId: string;
    requestedShift?: IShift;
    status: StatusType;
    note?: string;
}

export const mapToTradeRequest = (id: string, data: any): ITradeRequest => {
    return {
        id: id,
        proposedDate: data.proposedDate.toDate(),
        proposedUser: data.proposedUser,
        proposedUserId: data.proposedUserId,
        proposedShiftId: data.proposedShiftId,
        requestedUser: data.requestedUser,
        requestedUserId: data.requestedUserId,
        requestedShiftId: data.requestedShiftId,
        status: data.status,
    };
};
