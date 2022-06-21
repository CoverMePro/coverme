import { StatusType } from './Types';

type TimeOffType = 'Vacation' | 'Lieu' | 'Floater' | 'Other';

export interface ITimeOffRequest {
    id?: string;
    requestDate: Date;
    type: TimeOffType;
    userId: string;
    teams: string[];
    timeOffStart: Date;
    timeOffEnd: Date;
    status: StatusType;
}

export interface ITimeOff {
    id?: string;
    userId: string;
    teams: string[];
    name: string;
    startDateTime: string;
    endDateTime: string;
}

export const mapToTimeOffRequest = (id: string, data: any): ITimeOffRequest => {
    return {
        id: id,
        requestDate: data.requestDate.toDate(),
        type: data.type,
        userId: data.userId,
        teams: data.teams,
        timeOffStart: data.timeOffStart.toDate(),
        timeOffEnd: data.timeOffEnd.toDate(),
        status: data.status,
    };
};

export const mapToTimeOff = (id: string, data: any): ITimeOff => {
    return {
        id: id,
        userId: data.userId,
        teams: data.teams,
        name: data.name,
        startDateTime: data.startDateTime.toDate(),
        endDateTime: data.endDateTime.toDate(),
    };
};
