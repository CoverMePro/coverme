import { StaffRequestStatus } from '../../../types';

export interface ISickDisplay {
    id: string;
    date: string;
    user: string;
    shift: string;
    status: StaffRequestStatus;
}
