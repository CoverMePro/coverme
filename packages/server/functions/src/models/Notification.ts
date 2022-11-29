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
    usersNotified: string[];
}

export const mapToNotification = (id: string, data: any): INotification => {
    let notification: INotification = {
        id: id,
        messageType: data.messageType,
        messageTitle: data.messageTitle,
        messageBody: data.messageBody,
        usersNotified: data.usersNotified,
    };

    return notification;
};
