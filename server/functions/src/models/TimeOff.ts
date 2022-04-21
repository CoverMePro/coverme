import { StatusType } from './Types';

type TimeOffType = 'Vacation' | 'Lieu' | 'Floater' | 'Other';

export interface ITimeOffRequest {
    id?: string;
    requestDate?: Date;
    type?: TimeOffType;
    userId?: string;
    teams?: string[];
    timeOffStart?: Date;
    timeOffEnd?: Date;
    shiftsIdsEffected?: string[];
    description?: string;
    status?: StatusType;
}

export interface ITimeOff {
    id?: string;
    userId?: string;
    teams?: string[];
    name?: string;
    startDateTime?: string;
    endDateTime?: string;
}
