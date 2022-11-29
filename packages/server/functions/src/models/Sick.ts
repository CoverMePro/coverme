import { IShift } from './Shift';
import { StatusType } from './Types';

export interface ISickRequest {
    id?: string;
    requestDate: Date;
    userId: string;
    user: string;
    shiftId: string;
    teamId: string;
    shift?: IShift;
    status: StatusType;
}

export const mapToSickRequest = (id: string, data: any): ISickRequest => {
    return {
        id: id,
        requestDate: data.requestDate.toDate(),
        userId: data.userId,
        user: data.user,
        shiftId: data.shiftId,
        teamId: data.teamId,
        status: data.status,
    };
};
