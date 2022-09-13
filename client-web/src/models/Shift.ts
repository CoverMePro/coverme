export interface IShift {
    id: string;
    userId: string;
    teamId: string;
    userName: string;
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
    userName?: string;
    teamId?: string;
    startDate?: Date;
    endDate?: Date;
}
