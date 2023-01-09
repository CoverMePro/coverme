import { Request, Response } from 'express';
import {
	INotification,
	NotificationType,
	IScheduleStaff,
	IShift,
	IShiftTemplate,
	IShiftRotation,
	IShiftRotationTransaction,
	IShiftTransaction,
	ITeam,
	ITimeOff,
	IUser,
} from 'coverme-shared';
import dbHandler from '../db/db-handler';
import { getShiftDataDateRange, getShiftDataTodayOnward } from '../db/db-helpers';
import { getBatch } from '../db/batch-handler';

const getShiftsAndStaffFromCompany = async (req: Request, res: Response) => {
	try {
		const users = await dbHandler.getCollection<IUser>('users');

		const staff: IScheduleStaff[] = [];

		users.forEach((user) => {
			staff.push({
				id: 'unclaimed',
				teams: [],
				userId: 'unclaimed',
				userName: 'unassigned',
				title: 'unassigned',
				employeeType: 'unassigned',
			});
			if (user.role === 'staff') {
				staff.push({
					id: user.id,
					teams: user.teams ? user.teams : [],
					userId: user.id,
					userName: `${user.firstName} ${user.lastName}`,
					title: `${user.firstName} ${user.lastName}`,
					employeeType: user.employeeType,
				});
			}
		});

		const [teams, shifts, timeOff, shiftTemplates, shiftRotations] =
			await dbHandler.getMultipleCollections([
				dbHandler.getCollection<ITeam>('teams'),
				dbHandler.getCollection<IShift>('shifts'),
				dbHandler.getCollection<ITimeOff>('time-off'),
				dbHandler.getCollection<IShiftTemplate>('shift-templates'),
				dbHandler.getCollection<IShiftRotation>('shift-rotations'),
			]);

		return res.json({
			staff: staff,
			shifts: shifts,
			teams: teams,
			timeOff: timeOff,
			shiftDefs: shiftTemplates,
			rotations: shiftRotations,
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: error });
	}
};

const getEndDate = (startDate: Date, duration: string) => {
	const durHrs = duration?.substring(0, 2);
	const durMin = duration?.substring(3);

	const hours = parseInt(durHrs!, 10);
	const mins = parseInt(durMin!, 10);

	const endDate = new Date(startDate);

	endDate.setTime(endDate.getTime() + hours * 60 * 60 * 1000 + mins * 60 * 1000);

	return endDate;
};

/**
 *  Organize and carry out specific db request based on transactions (add, change, remove)
 */
const transactionShifts = async (req: Request, res: Response) => {
	const batch = getBatch();

	const transactions: IShiftTransaction[] = req.body.transactions;
	const rotationTransactions: IShiftRotationTransaction[] = req.body.rotationTransactions;

	const usersNotified: string[] = [];

	for (let i = 0; i < transactions.length; i++) {
		const transaction = transactions[i];

		if (usersNotified.findIndex((id) => id === transaction.userId) === -1) {
			usersNotified.push(transaction.userId!);
		}

		switch (transaction.type) {
			case 'add':
				batch.create(dbHandler.getCollectionSnapshot('/shifts'), {
					name: transaction.name,
					userId: transaction.userId === '' ? 'unclaimed' : transaction.userId,
					userName: transaction.userName === '' ? 'unclaimed' : transaction.userName,
					teamId: transaction.teamId,
					startDateTime: new Date(transaction.startDate!),
					endDateTime: new Date(transaction.endDate!),
				});
				break;
			case 'remove':
				batch.delete(dbHandler.getDocumentSnapshot(`/shifts/${transaction.id}`));
				break;
			case 'change':
				batch.update(dbHandler.getDocumentSnapshot(`/shifts/${transaction.id}`), {
					userId: transaction.userId,
					teamId: transaction.teamId,
					userName: transaction.userName,
					startDateTime: new Date(transaction.startDate!),
					endDateTime: new Date(transaction.endDate!),
				});
				break;
		}
	}

	for (let i = 0; i < rotationTransactions.length; i++) {
		const rotTransaction = rotationTransactions[i];

		if (usersNotified.findIndex((id) => id === rotTransaction.userId) === -1) {
			usersNotified.push(rotTransaction.userId!);
		}

		const end = new Date(rotTransaction.endDate);
		const rotation = rotTransaction.rotation;

		for (let d = new Date(rotTransaction.startDate); d <= end; d.setDate(d.getDate() + 1)) {
			let shiftStartDate: Date = new Date(d);
			let shiftEndDate: Date = new Date(d);

			let shiftName: String = 'test';

			let foundShift = false;

			switch (d.getDay()) {
				case 0:
					if (rotation.shifts.sunday) {
						shiftStartDate = new Date(d);
						shiftStartDate.setHours(
							rotation.shifts.sunday.timeHour,
							rotation.shifts.sunday.timeMinute
						);

						shiftEndDate = getEndDate(shiftStartDate, rotation.shifts.sunday.duration);
						shiftName = rotation.shifts.sunday.name;
						foundShift = true;
					}
					break;
				case 1:
					if (rotation.shifts.monday) {
						shiftStartDate = new Date(d);
						shiftStartDate.setHours(
							rotation.shifts.monday.timeHour,
							rotation.shifts.monday.timeMinute
						);

						shiftEndDate = getEndDate(shiftStartDate, rotation.shifts.monday.duration);
						shiftName = rotation.shifts.monday.name;
						foundShift = true;
					}
					break;
				case 2:
					if (rotation.shifts.tuesday) {
						shiftStartDate = new Date(d);
						shiftStartDate.setHours(
							rotation.shifts.tuesday.timeHour,
							rotation.shifts.tuesday.timeMinute
						);

						shiftEndDate = getEndDate(shiftStartDate, rotation.shifts.tuesday.duration);
						shiftName = rotation.shifts.tuesday.name;
						foundShift = true;
					}
					break;
				case 3:
					if (rotation.shifts.wednesday) {
						shiftStartDate = new Date(d);
						shiftStartDate.setHours(
							rotation.shifts.wednesday.timeHour,
							rotation.shifts.wednesday.timeMinute
						);

						shiftEndDate = getEndDate(
							shiftStartDate,
							rotation.shifts.wednesday.duration
						);
						shiftName = rotation.shifts.wednesday.name;
						foundShift = true;
					}
					break;
				case 4:
					if (rotation.shifts.thursday) {
						shiftStartDate = new Date(d);
						shiftStartDate.setHours(
							rotation.shifts.thursday.timeHour,
							rotation.shifts.thursday.timeMinute
						);

						shiftEndDate = getEndDate(
							shiftStartDate,
							rotation.shifts.thursday.duration
						);
						shiftName = rotation.shifts.thursday.name;
						foundShift = true;
					}
					break;
				case 5:
					if (rotation.shifts.friday) {
						shiftStartDate = new Date(d);
						shiftStartDate.setHours(
							rotation.shifts.friday.timeHour,
							rotation.shifts.friday.timeMinute
						);

						shiftEndDate = getEndDate(shiftStartDate, rotation.shifts.friday.duration);
						shiftName = rotation.shifts.friday.name;
						foundShift = true;
					}
					break;
				case 6:
					if (rotation.shifts.saturday) {
						shiftStartDate = new Date(d);
						shiftStartDate.setHours(
							rotation.shifts.saturday.timeHour,
							rotation.shifts.saturday.timeMinute
						);

						shiftEndDate = getEndDate(
							shiftStartDate,
							rotation.shifts.saturday.duration
						);
						shiftName = rotation.shifts.saturday.name;
						foundShift = true;
					}
					break;
			}

			if (foundShift) {
				batch.create(dbHandler.getDocumentSnapshot('shifts'), {
					name: shiftName,
					userId: rotTransaction.userId,
					userName: rotTransaction.userName,
					teamId: rotTransaction.teamId,
					startDateTime: shiftStartDate,
					endDateTime: shiftEndDate,
				});
			}
		}
	}

	try {
		await batch.commit();

		const newNotifiedUsers = usersNotified.filter((notified) => notified !== 'unclaimed');

		const notification: INotification = {
			messageTitle: 'Schedule updated!',
			messageType: NotificationType.SHIFT,
			messageBody: 'Your schedule has changed, please view the calendar.',
			usersNotified: newNotifiedUsers,
		};

		await dbHandler.addDocument('notifications', notification);

		return res.json({ message: 'transactions completed!' });
	} catch (error) {
		console.error(error);
		return res.json({ error: error });
	}
};

const createShiftTemplate = async (req: Request, res: Response) => {
	const shiftTemplateToAdd: IShiftTemplate = req.body;

	try {
		const addedShiftTemplate: IShiftTemplate = await dbHandler.addDocument<IShiftTemplate>(
			'shift-templates',
			shiftTemplateToAdd
		);

		return res.json(addedShiftTemplate);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: error });
	}
};

const deleteShiftTemplate = async (req: Request, res: Response) => {
	const id = req.params.id;

	try {
		await dbHandler.deleteDocument('shift-templates', id);
		return res.json({ message: 'Shift template deleted!' });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: error });
	}
};

const getShiftTemplates = async (_: Request, res: Response) => {
	try {
		const shiftTemplates = await dbHandler.getCollection<IShiftTemplate>('shift-templates');

		return res.json(shiftTemplates);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: error });
	}
};

const createShiftRotation = async (req: Request, res: Response) => {
	const shiftRotationToAdd: IShiftRotation = req.body;

	try {
		const addedShiftRotation = await dbHandler.addDocument<IShiftRotation>(
			'shift-rotations',
			shiftRotationToAdd
		);

		return res.json(addedShiftRotation);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: error });
	}
};

const deleteShiftRotation = async (req: Request, res: Response) => {
	const id = req.params.id;

	try {
		await dbHandler.deleteDocument('shift-rotations', id);
		return res.json({ message: 'Shift template deleted!' });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: error });
	}
};

const getShiftRotations = async (req: Request, res: Response) => {
	try {
		const shiftRotations = await dbHandler.getCollection<IShiftRotation>('shift-rotations');
		return res.json(shiftRotations);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: error });
	}
};

const getShiftFromUser = async (req: Request, res: Response) => {
	const { user } = req.params;

	try {
		const shifts = await dbHandler.getCollectionWithCondition<IShift>(
			'shifts',
			'userId',
			'==',
			user
		);
		return res.json(shifts);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: error });
	}
};

const getShiftsFromTodayOnward = async (req: Request, res: Response) => {
	let { user } = req.params;
	try {
		const shifts = await getShiftDataTodayOnward(user);
		return res.json(shifts);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: error });
	}
};

const getShiftsFromDateRange = async (req: Request, res: Response) => {
	const { user } = req.params;

	const { startRange, endRange } = req.body;

	try {
		const shifts = await getShiftDataDateRange(user, startRange, endRange);
		return res.json(shifts);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: error });
	}
};

export default {
	getShiftsAndStaffFromCompany,
	transactionShifts,
	createShiftTemplate,
	deleteShiftTemplate,
	getShiftTemplates,
	createShiftRotation,
	deleteShiftRotation,
	getShiftRotations,
	getShiftFromUser,
	getShiftsFromTodayOnward,
	getShiftsFromDateRange,
};
