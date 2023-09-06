import { OvertimePhase, ShiftRequestStatus } from '../../types';
export interface ICallout {
    userId: string;
    userName: string;
    status: ShiftRequestStatus;
    phone: string;
    contactBy: string;
    team: string;
}
export interface IOvertime {
    id?: string;
    dateCreated?: Date;
    shiftInfo: string;
    status: string;
    team: string;
    managerNumbers: string[];
    callouts: ICallout[];
    phase: OvertimePhase;
    archive: boolean;
    shiftAcceptedBy?: string;
    allNotifed?: boolean;
    alldeclined?: boolean;
    exclude?: string[];
}
