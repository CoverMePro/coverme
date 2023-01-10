import { StaffRequestStatus, TimeOffType } from '../../../types';

export interface ITimeOffDisplay {
    id: string;
    requestDate: string;
    type: TimeOffType;
    user: string;
    startDate: string;
    endDate: string;
    status: StaffRequestStatus;
}
