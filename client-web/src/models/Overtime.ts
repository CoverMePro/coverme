export interface ICallout {
    userId: string;
    userName: string;
    status: 'Pending' | 'Accepted' | 'Rejected';
    team: string;
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
