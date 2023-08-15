import { OvertimePhase, ShiftRequestStatus } from '../../types';

export interface ICallout {
	userId: string;
	userName: string;
	status: ShiftRequestStatus;
	phone: string;
	team: string; // do we need this anymore?
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
	shiftAcceptedBy?: string;
	allNotifed?: boolean;
	alldeclined?: boolean;
}
