export interface IMessage {
    id?: string;
    title: string;
    content: string;
    date: Date;
    userId: string;
    userName: string;
    for: string;
}

export const mapToMessage = (id: string, data: any): IMessage => {
    return {
        id: id,
        title: data.title,
        content: data.content,
        date: data.date.toDate(),
        userId: data.userId,
        userName: data.userName,
        for: data.for,
    };
};
