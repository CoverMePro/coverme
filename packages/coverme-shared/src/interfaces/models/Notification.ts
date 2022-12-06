export enum NotificationType {
    'SHIFT',
    'TRADE',
    'SICK',
    'TIMEOFF',
    'OVERTIME',
    'MESSAGE',
}

export interface INotification {
    id?: string;
    messageType: NotificationType;
    messageTitle: string;
    messageBody: string;
    usersNotified?: string[];
    meta?: any;
}
