import { Request, Response } from 'express';
import { IOvertime, ITeam, IUser } from '../coverme-shared';
import { getCalloutList, getCalloutStaffList } from '../db/db-helpers';
import calloutCyle, { AcceptAndComplete } from '../utils/overtime';
import dbHandler from '../db/db-handler';

/**
 * @api {post} /api/overtime-callouts Create Overtime Callout
 * @apiName createOvertimeCallout
 * @apiGroup Overtime Callouts
 *
 * @apiDescription Create an overtime callout that is added to the automation queue
 *
 * @apiBody {Object} calloutInfo The info required for the overtime callout
 * @apiBody {Date} calloutInfo.dateCreated The date in which this callout is created (optional)
 * @apiBody {String} calloutInfo.shiftInfo The shift information formatted in string for readability
 * @apiBody {String} calloutInfo.team The team the callout is for/orginated from
 * @apiBody {Array} calloutInfo.callouts The list of callouts to be made and current status
 * @apiBody {String} calloutInfo.callouts.userId The user id of the person being called
 * @apiBody {String} calloutInfo.callouts.userName The name of the person being called
 * @apiBody {String} calloutInfo.callouts.status The current status of the callout
 * @apiBody {String} calloutInfo.callouts.phone The phone number of the person being called
 * @apiBody {String} calloutInfo.callouts.contactBy The method of contact for the callout
 * @apiBody {String} calloutInfo.callouts.team The team the person being called is on
 * @apiBody {String} calloutInfo.phase The phase of the callout. Either Internal for still contacting within team or external for contacting the rest of the employees
 * @apiBody {Boolean} calloutInfo.archive If the callout is archived
 * @apiBody {String} calloutInfo.shiftAcceptedBy The user id of the person who accepted the shift (optional)
 * @apiBody {Boolean} calloutInfo.allNotifed If all users have been notified (optional)
 * @apiBody {Boolean} calloutInfo.alldeclined If all users have declined (optional)
 * @apiBody {Array} calloutInfo.exclude The list of users to exclude from the callout (optional)
 *
 * @apiSuccess {Object} The newly created Callout
 *
 * @apiError (Error 500) {Object} errorResult The error result object.
 * @apiError (Error 500) {String} errorResult.error Message explaining the error.
 */
const createOvertimeCallout = async (req: Request, res: Response) => {
	const overtimeCallout: IOvertime = req.body;

	try {
		const team = await dbHandler.getDocumentById<ITeam>('teams', overtimeCallout.team);

		const managers = await dbHandler.getCollectionWithCondition<IUser>(
			'users',
			'__name__',
			'in',
			team.managers
		);

		const addedOvertime: IOvertime = await dbHandler.addDocument<IOvertime>(
			'overtime-callouts',
			{
				...overtimeCallout,
				dateCreated: new Date(),
				managerNumbers: managers.map((manager) => manager.phone),
			}
		);

		return res.json(addedOvertime);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: error });
	}
};

/**
 * @api {get} /api/overtime-callouts Get All Users
 * @apiName getOvertimeCallouts
 * @apiGroup Overtime Callouts
 *
 * @apiDescription Get all the overtime callouts that are currently active
 *
 * @apiSuccess {Object[]} users An array of all active callouts.
 *
 * @apiError (Error 500) {Object} errorResult The error result object.
 * @apiError (Error 500) {String} errorResult.error Message explaining the error.
 */
const getOvertimeCallouts = async (req: Request, res: Response) => {
	try {
		const overtimeCallouts = await dbHandler.getCollectionWithConditionAndSort<IOvertime>(
			'overtime-callouts',
			'archive',
			'==',
			false,
			'dateCreated',
			'asc'
		);

		return res.json(overtimeCallouts);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: error });
	}
};

// TODO: UNDERSTAND
/**
 * @api {get} /api/overtime-callouts/:id/:user/info Get Useer Status Info on Callout
 * @apiName getOvertimeCalloutInfoForUser
 * @apiGroup Overtime Callouts
 *
 * @apiDescription Get the current status of a user in a specific callout
 *
 * @apiParam {String} id the id of the callout
 * @apiParam {String} user the id of the user
 *
 * @apiSuccess {Object[]} users An array of all active callouts.
 *
 * @apiError (Error 500) {Object} errorResult The error result object.
 * @apiError (Error 500) {String} errorResult.error Message explaining the error.
 */
const getOvertimeCalloutInfoForUser = async (req: Request, res: Response) => {
	const { user, id } = req.params;

	try {
		const overtimeCallout = await dbHandler.getDocumentFromCollectionWithCondition<IOvertime>(
			'overtime-callouts',
			'__name__',
			'==',
			id
		);

		let hasBeenReached = false;
		let hasAnswered = false;

		overtimeCallout.callouts.forEach((callout) => {
			if (callout.userId === user) {
				hasBeenReached = true;

				if (callout.status !== 'Pending') {
					hasAnswered = true;
				}
			}
		});

		if (!hasBeenReached) {
			// ERROR: NOT CONTACTED
			return res.status(400).json({ error: 'NOT_CONTACTED' });
		}

		if (hasAnswered) {
			// ERROR: ALREADY ANSWERED
			return res.status(409).json({ error: 'ALREADY_ANSWERED' });
		}

		return res.json(overtimeCallout);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: error });
	}
};

/**
 * @api {post} /api/overtime-callouts/accept User Accept Callout Shift
 * @apiName acceptCalloutShift
 * @apiGroup Overtime Callouts
 *
 * @apiDescription When user acceptes a callout. This endpoint is access from the Click send response api when user accepts from either text or phone call
 *
 * @apiBody {Object} smsInfo The object containing the information from the sms from clicksend
 * @apiBody {String} smsInfo.custom_string The custom string from the sms that has the information needed from the user
 *
 * @apiSuccess {Object} result The success result object.
 * @apiSuccess {String} result.message Success message.
 *
 * @apiError (Error 500) {Object} errorResult The error result object.
 * @apiError (Error 500) {String} errorResult.error Message explaining the error.
 */
const acceptCalloutShift = async (req: Request, res: Response) => {
	const smsInfo = req.body;

	const customInfo = (smsInfo.custom_string as string).split('|');

	const overtimeId = customInfo[0];
	const userId = customInfo[1];

	try {
		const overtimeCallout: IOvertime = await dbHandler.getDocumentById<IOvertime>(
			'overtime-callouts',
			overtimeId
		);

		const calloutList = [...overtimeCallout.callouts!];

		const userInListIdx = calloutList.findIndex((user) => user.userId === userId);

		if (userInListIdx != -1) {
			calloutList[userInListIdx].status = 'Accepted';

			if (overtimeCallout.allNotifed) {
				await AcceptAndComplete(calloutList[userInListIdx], overtimeCallout);
			}

			await dbHandler.updateDocument('overtime-callouts', overtimeId, {
				callouts: calloutList,
			});

			return res.json({ message: 'shift has been accepted' });
		}

		return res.status(500).json({ error: 'No user found in callout request' });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: error });
	}
};

/**
 * @api {post} /api/overtime-callouts/accept User Reject Callout Shift
 * @apiName rejectedCalloutShift
 * @apiGroup Overtime Callouts
 *
 * @apiDescription When user rejects  a callout. This endpoint is access from the Click send response api when user accepts from either text or phone call
 *
 * @apiBody {Object} smsInfo The object containing the information from the sms from clicksend
 * @apiBody {String} smsInfo.custom_string The custom string from the sms that has the information needed from the user
 *
 * @apiSuccess {Object} result The success result object.
 * @apiSuccess {String} result.message Success message.
 *
 * @apiError (Error 500) {Object} errorResult The error result object.
 * @apiError (Error 500) {String} errorResult.error Message explaining the error.
 */
const rejectedCalloutShift = async (req: Request, res: Response) => {
	console.log('IN REJECTION');
	const smsInfo = req.body;

	const customInfo = (smsInfo.custom_string as string).split('|');

	const overtimeId = customInfo[0];
	const userId = customInfo[1];

	try {
		const overtimeCallout: IOvertime = await dbHandler.getDocumentById<IOvertime>(
			'overtime-callouts',
			overtimeId
		);

		const calloutList = [...overtimeCallout.callouts!];

		const userInListIdx = calloutList.findIndex((user) => user.userId === userId);

		if (userInListIdx != -1) {
			calloutList[userInListIdx].status = 'Rejected';

			await dbHandler.updateDocument('overtime-callouts', overtimeId, {
				callouts: calloutList,
			});

			return res.json({ message: 'shift has been rejected' });
		}

		return res.status(500).json({ error: 'No user found in callout request' });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: error });
	}
};

/**
 * @api {get} /api/overtime-callouts/:id/archive Archive Callout
 * @apiName archiveOvertimeCallout
 * @apiGroup Overtime Callouts
 *
 * @apiDescription Archive a callout so it does not appear anymore and is just for records
 *
 * @apiParam {String} id the id of the callout
 *
 * @apiSuccess {Object} result The success result object.
 * @apiSuccess {String} result.message Success message.
 *
 * @apiError (Error 500) {Object} errorResult The error result object.
 * @apiError (Error 500) {String} errorResult.error Message explaining the error.
 */
const archiveOvertimeCallout = async (req: Request, res: Response) => {
	const { id } = req.params;

	try {
		await dbHandler.updateDocument('overtime-callouts', id, {
			archive: true,
		});

		return res.json({ message: 'Overtime callout archived' });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: error });
	}
};

/**
 * @api {post} /api/overtime-callouts/voice-reponse User Voice Response
 * @apiName voiceProcess
 * @apiGroup Overtime Callouts
 *
 * @apiDescription Processing the users response on voice call. This endpoint is access from the Click send response api when user accepts from  phone call
 *
 * @apiBody {Object} voiceInfo The object containing the information from the sms from clicksend
 * @apiBody {String} voiceInfo.digits The response the user gave on the phone call
 * @apiBody {String} voiceInfo.custom_string The custom string from the sms that has the information needed from the user
 *
 * @apiSuccess {Object} result The success result object.
 * @apiSuccess {String} result.message Success message.
 *
 * @apiError (Error 500) {Object} errorResult The error result object.
 * @apiError (Error 500) {String} errorResult.error Message explaining the error.
 */
const voiceProcess = async (req: Request, res: Response) => {
	console.log('In VOICE PROCESS');

	const voiceInfo = req.body;

	const response = voiceInfo.digits ? (voiceInfo.digits as string).charAt(0) : '0';
	const customInfo = (voiceInfo.custom_string as string).split('|');

	const overtimeId = customInfo[0];
	const userId = customInfo[1];

	try {
		const overtimeCallout: IOvertime = await dbHandler.getDocumentById<IOvertime>(
			'overtime-callouts',
			overtimeId
		);

		const calloutList = [...overtimeCallout.callouts!];

		const userInListIdx = calloutList.findIndex((user) => user.userId === userId);

		if (userInListIdx != -1) {
			calloutList[userInListIdx].status = response === '1' ? 'Accepted' : 'Rejected';

			await dbHandler.updateDocument('overtime-callouts', overtimeId, {
				callouts: calloutList,
			});

			console.log(`${response === '1' ? 'ACCEPTED' : 'REJECTED'} SHIFT WOO`);

			return res.json({
				message: `shift has been ${response === '1' ? 'ACCEPTED' : 'REJECTED'}`,
			});
		}

		return res.status(500).json({ error: 'No user found in callout request' });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: error });
	}
};

const testCycleCallout = (_: Request, res: Response) => {
	calloutCyle()
		.then(() => {
			return res.json({ message: 'callout round complete' });
		})
		.catch((err) => {
			console.error(err);
			return res.status(500).json({ error: err });
		});
};

const getCompanyOvertimeCalloutList = (_: Request, res: Response) => {
	getCalloutList()
		.then(({ staff, lastCallouts }) => {
			return res.json({ staff: staff, lastCallouts: lastCallouts });
		})
		.catch((err) => {
			console.error(err);
			return res.status(500).json({ error: err.code });
		});
};

const getCompanyOvertimeCalloutStaffList = (_: Request, res: Response) => {
	getCalloutStaffList()
		.then(({ lastCallouts }) => {
			return res.json({ lastCallouts: lastCallouts });
		})
		.catch((err) => {
			console.error(err);
			return res.status(500).json({ error: err.code });
		});
};

const assignLastCallout = async (req: Request, res: Response) => {
	const { staffId, team } = req.body;

	try {
		if (team === 'all') {
			await dbHandler.updateDocument('last-callouts', 'external', {
				id: staffId,
			});
		} else {
			await dbHandler.updateDocument('last-callouts', 'internal', {
				[team]: staffId,
			});
		}

		return res.json({
			message: `Last callout assigned to new staff`,
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: error });
	}
};

export default {
	createOvertimeCallout,
	getOvertimeCallouts,
	getOvertimeCalloutInfoForUser,
	acceptCalloutShift,
	rejectedCalloutShift,
	archiveOvertimeCallout,
	voiceProcess,
	testCycleCallout,
	getCompanyOvertimeCalloutList,
	getCompanyOvertimeCalloutStaffList,
	assignLastCallout,
};
