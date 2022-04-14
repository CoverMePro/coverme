import { StatusType } from './Types';

type TimeOffType = 'Vacation' | 'Lieu' | 'Floater' | 'Other';

export interface ITimeOffRequest {
    id?: string;
    requestDate?: Date;
    type?: TimeOffType;
    userId?: string;
    timeOffStart?: Date;
    timeOffEnd?: Date;
    shiftsIdsEffected?: string[];
    description?: string;
    status?: StatusType;
}
