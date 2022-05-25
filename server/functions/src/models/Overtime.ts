export interface ICallout {
    user: string;
    status: 'Pending' | 'Accepted' | 'Rejected';
    team: string;
    rank: number;
}

export interface IOvertime {
    company?: string;
    shiftId?: string;
    status?: string;
    team?: string;
    userRank?: string[];
    callouts?: ICallout[];
}
