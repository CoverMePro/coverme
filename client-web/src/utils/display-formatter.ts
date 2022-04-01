import { ISickDisplay, ISickRequest } from 'models/Sick';
import { ITradeDisplay, ITradeRequest } from 'models/Trade';
import { formatDateTimeOutputString, formatDateString } from './date-formatter';

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

export const formatTradeDisplay = (
    tradeRequest: ITradeRequest,
    isProposed: boolean
): ITradeDisplay => {
    return {
        id: tradeRequest.id!,
        date: formatDateString(tradeRequest.proposedDate!),
        tradeWithUser: isProposed ? tradeRequest.requestedUser! : tradeRequest.proposedUser!,
        tradingShift: isProposed
            ? formatDateTimeOutputString(
                  tradeRequest.proposedShift!.startDateTime,
                  tradeRequest.proposedShift!.endDateTime
              )
            : formatDateTimeOutputString(
                  tradeRequest.requestedShift!.startDateTime,
                  tradeRequest.requestedShift!.endDateTime
              ),
        receiveShift: isProposed
            ? formatDateTimeOutputString(
                  tradeRequest.requestedShift!.startDateTime,
                  tradeRequest.requestedShift!.endDateTime
              )
            : formatDateTimeOutputString(
                  tradeRequest.proposedShift!.startDateTime,
                  tradeRequest.proposedShift!.endDateTime
              ),
        archiveUsers: tradeRequest.archiveUsers,
        status: getStatus(tradeRequest.status),
    };
};

export const formatSickDisplay = (sickRequest: ISickRequest): ISickDisplay => {
    return {
        id: sickRequest.id!,
        date: formatDateString(sickRequest.requestDate!),
        user: sickRequest.userId!,
        shift: formatDateTimeOutputString(
            sickRequest.shift!.startDateTime,
            sickRequest.shift!.endDateTime
        ),
        status: sickRequest.status!,
    };
};
