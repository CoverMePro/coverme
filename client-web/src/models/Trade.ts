export interface ITradeRequest {
    proposedUser: string;
    proposedShiftId: string;
    requestedUser: string;
    requestedShiftId: string;
    status:
        | 'Pending Response'
        | 'Declinde'
        | 'Waiting Approval'
        | 'Manager Approved'
        | 'Manager Denied';
    note?: string;
}
