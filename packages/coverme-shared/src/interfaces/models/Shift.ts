import { TransactionType } from 'types';

export interface IShift {
    id: string;
    userId: string;
    teamId: string;
    userName: string;
    name: string;
    startDateTime: string;
    endDateTime: string;
}

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

export interface IShiftTemplate {
    id?: string;
    name: string;
    startTimeHours: number;
    startTimeMinutes: number;
    duration: string;
}
