export interface INotification {
    id: string;
    messageTitle: string;
    messageBody: string;
    usersNotified?: string[];
}
