import { IShift, IUser } from 'coverme-shared';
import { db } from '../utils/admin';

export const handleError = (error: any) => {
	if (typeof error === 'string') {
		return new Error(error);
	} else if (error instanceof Error) {
		return new Error(error.message);
	}
	return new Error('Unexpected error has occrued');
};

export const updateNewUserIntoDb = (userInfo: IUser) => {
	return db.collection(`/users`).add({
		...userInfo,
		status: 'Pending',
		statusUpdatedAt: Date.now(),
		teams: [],
	});
};

export const getCalloutList = () => {
	const users: IUser[] = [];
	let lastCallouts: any;
	return db
		.collection('/users')
		.where('role', '==', 'staff')
		.where('employeeType', '==', 'Full-Time')
		.orderBy('hireDate', 'asc')
		.get()
		.then((userDocs) => {
			userDocs.forEach((doc) => {
				users.push(mapFireStoreData(doc.id, doc.data()));
			});

			return db.collection(`/last-callouts`).get();
		})
		.then((result) => {
			if (result.empty) {
				lastCallouts = {};
			} else {
				result.docs.forEach((doc) => {
					lastCallouts = {
						...lastCallouts,
						[doc.id]: doc.data(),
					};
				});
			}

			return { users: users, lastCallouts: lastCallouts };
		})
		.catch((err) => {
			throw new Error(err);
		});
};

export const getShiftDataTodayOnward = (user: string) => {
	return db
		.collection(`/shifts`)
		.where('userId', '==', user)
		.where('startDateTime', '>', new Date())
		.get()
		.then((shiftDocs) => {
			const shifts: IShift[] = formatFirestoreData(shiftDocs);

			return shifts;
		})
		.catch((err) => {
			throw handleError(err);
		});
};

export const getShiftDataDateRange = (user: string, startRange: string, endRange: string) => {
	return db
		.collection(`/shifts`)
		.where('userId', '==', user)
		.where('startDateTime', '>=', new Date(startRange))
		.where('startDateTime', '<=', new Date(endRange))
		.get()
		.then((shiftDocs) => {
			const shifts: IShift[] = formatFirestoreData(shiftDocs);

			return shifts;
		})
		.catch((err) => {
			throw handleError(err);
		});
};

const isTimestamp = (object: any) => {
	return '_seconds' in object && '_nanoseconds' in object;
};

const formatDateData = (data: any) => {
	console.log(data);
	Object.keys(data).forEach(function (key, index) {
		if (typeof data[key] === 'object') {
			if (isTimestamp(data[key])) {
				data[key] = data[key].toDate();
			}
		}
	});

	return data;
};

export const mapFireStoreData = <T>(id: string, data: any, includeId = true): T => {
	let model: T;

	if (includeId) {
		model = {
			id,
			...formatDateData(data),
		};
	} else {
		model = {
			...formatDateData(data),
		};
	}

	return model;
};

export const formatFirestoreData = <T>(
	docs: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>
) => {
	const dataArray: T[] = [];

	docs.forEach((doc) => {
		dataArray.push(mapFireStoreData(doc.id, doc.data()));
	});

	return dataArray;
};
