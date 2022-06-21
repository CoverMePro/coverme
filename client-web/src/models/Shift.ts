export interface IShift {
    id: string;
    userId: string;
    teamId: string;
    name: string;
    startDateTime: string;
    endDateTime: string;
}

type TransactionType = 'add' | 'remove' | 'change';

export interface IShiftTransaction {
    type?: TransactionType;
    id?: string;
    instanceId?: string;
    name?: string;
    userId?: string;
    teamId?: string;
    startDate?: Date;
    endDate?: Date;
}
