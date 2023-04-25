import {
	IShiftTemplate,
	IShiftTemplateDisplay,
	IFullTradeDisplay,
	ITradeDisplay,
	ITradeRequest,
	IUserTradeInfo,
	ISickDisplay,
	ISickRequest,
	ITimeOffDisplay,
	ITimeOffRequest,
} from 'coverme-shared';
import {
	formatDateTimeOutputString,
	formatDateString,
	formatAMPM,
	formatDurationClean,
} from './dateTime-formatter';

const getStatus = (status: 'Pending' | 'Accepted' | 'Rejected') => {
	switch (status) {
		case 'Pending':
			return "Waiting for staff member's response";
		case 'Accepted':
			return 'Approved';
		case 'Rejected':
			return 'Rejected';
	}
};

const listUser = (user: IUserTradeInfo) => `${user.name} (${user.email})`;
const listName = (user: IUserTradeInfo) => `${user.name}`;

export const formatTradeDisplay = (
	tradeRequest: ITradeRequest,
	isProposed: boolean
): ITradeDisplay => {
	return {
		id: tradeRequest.id!,
		date: formatDateString(tradeRequest.proposedDate!),
		tradeWithUser: isProposed
			? listUser(tradeRequest.requestedUser!)
			: listUser(tradeRequest.proposedUser!),
		tradingShift: isProposed
			? formatDateTimeOutputString(
					tradeRequest.proposedShift!.startDateTime as string,
					tradeRequest.proposedShift!.endDateTime as string
			  )
			: formatDateTimeOutputString(
					tradeRequest.requestedShift!.startDateTime as string,
					tradeRequest.requestedShift!.endDateTime as string
			  ),
		receiveShift: isProposed
			? formatDateTimeOutputString(
					tradeRequest.requestedShift!.startDateTime as string,
					tradeRequest.requestedShift!.endDateTime as string
			  )
			: formatDateTimeOutputString(
					tradeRequest.proposedShift!.startDateTime as string,
					tradeRequest.proposedShift!.endDateTime as string
			  ),
		archiveUsers: tradeRequest.archiveUsers,
		status: getStatus(tradeRequest.status),
	};
};

export const formatFullTradeDisplay = (tradeRequest: ITradeRequest): IFullTradeDisplay => {
	return {
		id: tradeRequest.id!,
		date: formatDateString(tradeRequest.proposedDate),
		proposedUser: listName(tradeRequest.proposedUser),
		receivingUser: listName(tradeRequest.requestedUser),
		proposedUserShiftTrading: formatDateTimeOutputString(
			tradeRequest.proposedShift!.startDateTime as string,
			tradeRequest.proposedShift!.endDateTime as string
		),
		recivingUserShiftTrading: formatDateTimeOutputString(
			tradeRequest.requestedShift!.startDateTime as string,
			tradeRequest.requestedShift!.endDateTime as string
		),
	};
};

export const formatSickDisplay = (sickRequest: ISickRequest): ISickDisplay => {
	return {
		id: sickRequest.id!,
		date: formatDateString(sickRequest.requestDate!),
		user: sickRequest.user!,
		shift: formatDateTimeOutputString(
			sickRequest.shift!.startDateTime as string,
			sickRequest.shift!.endDateTime as string
		),
		status: sickRequest.status!,
	};
};

export const formatTimeOffDisplay = (timeOffRequest: ITimeOffRequest): ITimeOffDisplay => {
	return {
		id: timeOffRequest.id!,
		requestDate: formatDateString(timeOffRequest.requestDate!),
		type: timeOffRequest.type!,
		startDate: formatDateString(timeOffRequest.timeOffStart!),
		endDate: formatDateString(timeOffRequest.timeOffEnd!),
		status: timeOffRequest.status!,
		user: timeOffRequest.user!,
	};
};

export const formatShiftTemplateDisplay = (
	shiftTemplate: IShiftTemplate
): IShiftTemplateDisplay => {
	return {
		id: shiftTemplate.id,
		name: shiftTemplate.name,
		duration: formatDurationClean(shiftTemplate.duration),
		startTime: formatAMPM(shiftTemplate.startTimeHours, shiftTemplate.startTimeMinutes),
	};
};
