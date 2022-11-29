type TransactionType = 'add' | 'remove' | 'change';

export interface IShiftTransaction {
    type: TransactionType;
    id?: string;
    instanceId?: string;
    name: string;
    userId: string;
    userName: string;
    companyId: string;
    teamId: string;
    startDate: Date;
    endDate: Date;
}
