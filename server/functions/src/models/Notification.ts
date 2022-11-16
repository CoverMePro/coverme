export interface INotification {
    id?: string;
    messageTitle: string;
    messageBody: string;
    usersNotified: string[];
}

export const mapToNotification = (id: string, data: any): INotification => {
    let notification: INotification = {
        id: id,
        messageTitle: data.messageTitle,
        messageBody: data.messageBody,
        usersNotified: data.usersNotified,
    };

    return notification;
};
