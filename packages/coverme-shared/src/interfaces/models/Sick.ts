import { IShift } from './Shift';
import { StaffRequestStatus } from 'types';

export interface ISickRequest {
    id?: string;
    requestDate: Date;
    userId: string;
    user: string;
    shiftId: string;
    shift?: IShift;
    status: StaffRequestStatus;
}
