import { StatusType } from './Types';

export type TimeOffType = 'Vacation' | 'Lieu' | 'Floater' | 'Other';

export interface ITimeOffRequest {
    id?: string;
    requestDate: Date;
    type: TimeOffType;
    userId: string;
    user: string;
    teams: string[];
    timeOffStart: Date;
    timeOffEnd: Date;
    status: StatusType;
}

export interface ITimeOffDisplay {
    id: string;
    requestDate: string;
    type: TimeOffType;
    user: string;
    startDate: string;
    endDate: string;
    status: StatusType;
}

export interface ITimeOff {
    id: string;
    userId: string;
    userName: string;
    teams: string[];
    name: string;
    startDateTime: string;
    endDateTime: string;
}
