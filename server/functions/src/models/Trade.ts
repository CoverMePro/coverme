import { IShift } from './Shift';
import { StatusType } from './Types';

export interface ITradeRequest {
    id?: string;
    proposedDate: Date;
    proposedUser: string;
    proposedShiftId: string;
    proposedShift?: IShift;
    requestedUser: string;
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
        proposedShiftId: data.proposedShiftId,
        requestedUser: data.requestedUser,
        requestedShiftId: data.requestedShiftId,
        status: data.status,
    };
};
