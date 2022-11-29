import { ShiftRequestStatus } from 'types';

export interface ICallout {
    userId: string;
    userName: string;
    status: ShiftRequestStatus;
    team: string; // do we need this anymore?
}

export interface IOvertime {
    id?: string;
    dateCreated?: Date;
    company: string;
    shiftId: string;
    shiftInfo: string;
    status: string;
    team: string;
    callouts: ICallout[];
    shiftAcceptedBy?: string;
}
