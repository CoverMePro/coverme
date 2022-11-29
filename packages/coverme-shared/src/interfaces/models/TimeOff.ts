import { StaffRequestStatus, TimeOffType } from 'types';

export interface ITimeOffRequest {
    id?: string;
    requestDate: Date;
    type: TimeOffType;
    userId: string;
    user: string;
    teams: string[];
    timeOffStart: Date;
    timeOffEnd: Date;
    status: StaffRequestStatus;
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
