import { ITradeDisplay, ITradeRequest } from 'models/Trade';

const getStatus = (status: 'Pending' | 'Approved' | 'Rejected') => {
    switch (status) {
        case 'Pending':
            return "Waiting for staff member's response";
        case 'Approved':
            return 'Approved! shifts have been traded.';
        case 'Rejected':
            return 'Staff member has rejected trade';
    }
};

export default (tradeRequest: ITradeRequest[], isProposed: boolean): ITradeDisplay[] => {
    return tradeRequest.map((tradeRequest) => {
        return {
            id: tradeRequest.id!,
            date: tradeRequest.proposedDate!,
            tradeWithUser: isProposed ? tradeRequest.requestedUser! : tradeRequest.proposedUser!,
            tradingShift: isProposed ? tradeRequest.proposedShift! : tradeRequest.requestedShift!,
            receiveShift: isProposed ? tradeRequest.requestedShift! : tradeRequest.proposedShift!,
            status: getStatus(tradeRequest.status),
        };
    });
};
