export interface ITradeRequest {
    id?: string;
    proposedDate: Date;
    proposedUser: string;
    proposedShiftId: string;
    requestedUser: string;
    requestedShiftId: string;
    status:
        | 'Pending Staff Response'
        | 'Staff Rejected'
        | 'Waiting Approval'
        | 'Manager Approved'
        | 'Manager Denied';
    note?: string;
}
