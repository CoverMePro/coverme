import { ITradeDisplay, ITradeRequest } from 'models/Trade';
import { formatDateOutputString } from './date-formatter';

const getStatus = (status: 'Pending' | 'Approved' | 'Rejected') => {
    switch (status) {
        case 'Pending':
            return "Waiting for staff member's response";
        case 'Approved':
            return 'Approved';
        case 'Rejected':
            return 'Rejected';
    }
};

export default (tradeRequest: ITradeRequest, isProposed: boolean): ITradeDisplay => {
    return {
        id: tradeRequest.id!,
        date: tradeRequest.proposedDate!,
        tradeWithUser: isProposed ? tradeRequest.requestedUser! : tradeRequest.proposedUser!,
        tradingShift: isProposed
            ? formatDateOutputString(
                  tradeRequest.proposedShift!.startDateTime,
                  tradeRequest.proposedShift!.endDateTime
              )
            : formatDateOutputString(
                  tradeRequest.requestedShift!.startDateTime,
                  tradeRequest.requestedShift!.endDateTime
              ),
        receiveShift: isProposed
            ? formatDateOutputString(
                  tradeRequest.requestedShift!.startDateTime,
                  tradeRequest.requestedShift!.endDateTime
              )
            : formatDateOutputString(
                  tradeRequest.proposedShift!.startDateTime,
                  tradeRequest.proposedShift!.endDateTime
              ),
        status: getStatus(tradeRequest.status),
    };
};
