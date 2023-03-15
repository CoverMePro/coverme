import { IOvertime, ICallout, IUser, IShift } from 'coverme-shared';
import { getBatch } from '../db/batch-handler';
import dbHandler from '../db/db-handler';
import { getCalloutList, getShiftDataDateRange } from '../db/db-helpers';
import {sendConfirmOvertimeSms, sendManagerAllUsersDeclined, sendManagerAllUsersNotified, sendManagerUserAcceptedShift } from './sms';

const userContainsTeam = (user: IUser, team: string) => {
	if (!user.teams || user.teams.length === 0) {
		return false;
	}

	return user.teams.findIndex((t) => t === team) !== -1;
};

const isInCallouts = (callouts: ICallout[], user: IUser) => {
	return callouts.findIndex((callout) => callout.userId === user.id) !== -1;
};

const hasUserAcceptedCallout = async (callouts: ICallout[], overtime: IOvertime, team: string) => {
	let hasAccepted = false;

	for (let i = 0, len = callouts.length; i < len; ++i) {
		const callout = callouts[i];

		// if one of the users has chose to accept the shift
		if (callout.status === 'Accepted') {
			try {
				const batch = getBatch();

				// Update callout, shift, and the user as the last person to accept callout
				batch.update(dbHandler.getDocumentSnapshot(`overtime-callouts/${overtime.id}`), {
					shiftAcceptedBy: callout.userName,
					status: 'Complete',
				});

				batch.update(dbHandler.getDocumentSnapshot(`shifts/${overtime.shiftId}`), {
					userId: callout.userId,
				});

				// If its an internal user (user within the team) make sure to update correct 'last callout'
				// If external, then update that list.
				if (callout.team === 'internal') {
					batch.update(dbHandler.getDocumentSnapshot(`last-callouts/internal`), {
						[team]: callout.userId,
					});
				} else {
					batch.update(dbHandler.getDocumentSnapshot(`last-callouts/external`), {
						[team]: callout.userId,
					});
				}

				await batch.commit();

				console.log(`$$OVERTIME: User (${callout.userName}) accepted callout!`);

				sendManagerUserAcceptedShift(overtime, callout.userName);

				sendConfirmOvertimeSms(callout.phone, overtime);

				hasAccepted = true;
			} catch (err: any) {
				throw new Error(err.message);
			}
		}
	}

	return hasAccepted;
};

// const hasCalloutReachedShiftStartTimeRange = (shift: IShift, hourRange: number) => {
// 	const msBetweenDates = Math.abs(new Date().getTime() - (shift.startDateTime as Date).getTime());

// 	// 👇️ convert ms to hours                  min  sec   ms
// 	const hoursBetweenDates = msBetweenDates / (60 * 60 * 1000);

// 	if (hoursBetweenDates < hourRange) {
// 		// too close for call outs

// 		// end callouts for this one
// 		console.log(`WITHIN ${hourRange} HOURS!`);

// 		//TODO: update callout that it complete
// 		//TODO: notfiy manager shift has not been assinged

// 		return true;
// 	}

// 	return false;
// };

const hasReachedLimit = (array1: any[], array2: any[]) => {
	return array1.length === array2.length;
};

const hasAllUsersBeenNotifiedOrDeclined = async (users: IUser[], overtime:IOvertime, callouts: ICallout[]) => {
	// check if all users are notified, if so then dont go through all this
	if (hasReachedLimit(users, callouts)) {
		// check if all users declined, then end this callout
		let allDeclined = true;

		callouts.forEach((callout) => {
			if (callout.status !== 'Rejected') {
				allDeclined = false;
			}
		});

		if (allDeclined) {
			// close the callout so it doesnt run anymore
			//TODO: update callout that it complete
			//TODO: notfiy manager shift has not been assinged
			console.log(`$$OVERTIME: ALL USERS HAVE DECLINED`);
			//await sendManagerAllUsersDeclined();

			if (!overtime.alldeclined) {
				// true, notify
				await sendManagerAllUsersDeclined(overtime);

				//update overtime

				await dbHandler.updateDocument<IOvertime>('overtime-callouts', overtime.id!, {
					alldeclined: true
				});
			}

		}

		console.log(`$$OVERTIME: ALL USERS HAVE BEEN NOTIFIED`);

		if (!overtime.allNotifed) {
			await sendManagerAllUsersNotified(overtime);

			await dbHandler.updateDocument<IOvertime>('overtime-callouts', overtime.id!, {
				allNotifed: true
			});
		}

		return true;
	}

	return false;
};

const doesShiftConflictWithUser = async (user: IUser, shiftId: string) => {
	const shift: IShift = await dbHandler.getDocumentById<IShift>('shifts', shiftId);

	const conflictingShifts = await getShiftDataDateRange(user.id, shift.startDateTime.toString(), shift.endDateTime.toString());

	if (conflictingShifts.length > 0) {

	}

	return conflictingShifts.length > 0;
}

const checkForConflictingShiftUsers = async (callouts: ICallout[], users: IUser[], shiftId: string, phase: string) => {

	for (let i = 0; i < users.length; i++) {
		const selectedUser = users[i];

		if (isInCallouts(callouts, selectedUser)) {
			console.log(`$$OVERTIME CONFLICTING: ${selectedUser.firstName} ${selectedUser.lastName} IS IN CALLOUT`);
			continue;
		}

		if (await doesShiftConflictWithUser(selectedUser, shiftId)) {
			console.log(`$$OVERTIME: ${selectedUser.firstName} ${selectedUser.lastName} conflicts with the callout shift`);
			callouts.push({
				userId: selectedUser.id!,
				userName: `${selectedUser.firstName} ${selectedUser.lastName}`,
				phone: selectedUser.phone,
				team: phase,
				status: 'Rejected',
			})
		}
		
	}
}

const getNextUserToCallout = (callouts: ICallout[], users: IUser[], calloutIndex: number) => {
	let nextCalloutuser = users[calloutIndex];
	// loop through and get next user for call out
	while (callouts.length !== users.length) {
		nextCalloutuser = users[calloutIndex];

		if (isInCallouts(callouts, nextCalloutuser)) {
			calloutIndex = calloutIndex + 1 >= users.length ? 0 : calloutIndex + 1;
			continue;
		} else {
			break;
		}
	}

	return nextCalloutuser;
};

const getLastCalloutUserIndex = (lastCalloutUser: string, users: IUser[]) => {
	let calloutindex = 0;

	const userIndex = (lastCalloutUser)
		? users.findIndex((user) => user.id === lastCalloutUser)
		: -1;

	console.log(`$$OVERTIME: GOT USER INDEX: ${userIndex}`);

	if (userIndex !== -1) {
		calloutindex = userIndex + 1 >= users.length ? 0 : userIndex + 1;
	}

	return calloutindex;
};

const callout = async () => {
	try {
		const pendingOvertime = await dbHandler.getCollectionWithCondition<IOvertime>(
			'overtime-callouts',
			'status',
			'==',
			'Pending'
		);

		if (pendingOvertime.length === 0) return;

		pendingOvertime.forEach(async (overtime) => {
			const staffCalled = overtime.callouts ? [...overtime.callouts] : [];

			const { team, shiftId } = overtime;

			const userAcceptedCallout = await hasUserAcceptedCallout(staffCalled, overtime, team);

			if (userAcceptedCallout) return;

	

			// check if shit start time is in reasonable time to call out
			// if not, notify shift has not been assigned
			// method to calculate date within a certain time (1 hour)
			//if (hasCalloutReachedShiftStartTimeRange(shift, 1)) return;

			const { users, lastCallouts } = await getCalloutList();

			// check if all users are notified, if so then dont go through all this
			if (await hasAllUsersBeenNotifiedOrDeclined(users, overtime, staffCalled)) return;

			let userLists;
			let lastCalloutUser;
			let phase = 'internal';

			// check if in internal phase (staff within team of callout)
			// adjust the user list and last callout user accordingly
			if (!overtime.phase || overtime.phase === 'Internal') {
				console.log(`$$OVERTIME: INTERNAL PHASE`);
				userLists = users.filter((user) => userContainsTeam(user, team));
				lastCalloutUser = lastCallouts.internal[team]
					? lastCallouts.internal[team]
					: undefined;
			} else {
				console.log(`$$OVERTIME: EXTERNAL PHASE`);
				userLists = users;
				lastCalloutUser = lastCallouts.external.email;
				phase = 'external';
			}

			let calloutUserIndex = 0;

			await checkForConflictingShiftUsers(staffCalled, userLists, shiftId, phase);

			// get the new index of the user to callout
			console.log(`$$OVERTIME: FOUND LAST CALLOUT USER: ${lastCalloutUser}`);

			if (lastCalloutUser !== undefined) {
				calloutUserIndex = getLastCalloutUserIndex(lastCalloutUser, userLists);
				console.log(`$$OVERTIME: GOT CALLOUT INDEX: ${calloutUserIndex}`);
			}

			

			const userToCallout = getNextUserToCallout(staffCalled, userLists, calloutUserIndex);

			console.log(`$$OVERTIME: NEXT USER TO CALLOUT = ${userToCallout.firstName} ${userToCallout.lastName
			}`);

			staffCalled.push({
				userId: userToCallout.id!,
				userName: `${userToCallout.firstName} ${userToCallout.lastName}`,
				phone: userToCallout.phone,
				team: phase,
				status: 'Pending',
			});

			const batch = getBatch();

			batch.update(dbHandler.getDocumentSnapshot(`overtime-callouts/${overtime.id!}`), {
				callouts: [...staffCalled],
			});

			if (hasReachedLimit(staffCalled, userLists) && phase === 'internal') {
				console.log(`$$OVERTIME: CHANGING OVER TO EXTERNAL PHASE`);
				batch.update(dbHandler.getDocumentSnapshot(`overtime-callouts/${overtime.id!}`), {
					phase: 'external',
				});
			}

			await batch.commit();
			//await sendOvertimeSms(userToCallout, overtime, overtime.id!);
		});
	} catch (err: any) {
		console.error(err);
		throw new Error(err);
	}
};

export default callout;
