export interface ITradeDisplay {
    id: string;
    date: string;
    tradeWithUser: string;
    receiveShift: string;
    tradingShift: string;
    archiveUsers?: string[];
    status: string;
}

export interface IFullTradeDisplay {
    id: string;
    date: string;
    proposedUser: string;
    proposedUserShiftTrading: string;
    receivingUser: string;
    recivingUserShiftTrading: string;
    archiveUsers?: string[];
}
