export interface ICallout {
    user: string;
    phone: string;
    status: 'Pending' | 'Accepted' | 'Rejected';
    team: string;
}

type OvertimePhase = 'Internal' | 'External';

export interface IOvertime {
    id?: string;
    dateCreated: Date;
    company: string;
    shiftId: string;
    shiftInfo: string;
    status: string;
    team: string;
    callouts: ICallout[];
    phase: OvertimePhase;
    shiftAcceptedBy?: string;
}

export const mapToOvertime = (id: string, data: any): IOvertime => {
    let overtime: IOvertime = {
        id: id,
        dateCreated: data.dateCreated.toDate(),
        company: data.company,
        shiftId: data.shiftId,
        shiftInfo: data.shiftInfo,
        status: data.status,
        team: data.team,
        callouts: data.callouts ? data.callouts : [],
        phase: data.phase,
    };

    if (data.shiftAcceptedBy) {
        overtime.shiftAcceptedBy = data.shiftAcceptedBy;
    }

    return overtime;
};
