import { IUser, mapToUser } from '../models/User';
import { db } from './admin';

export const updateNewUserIntoDb = (userInfo: IUser, hireDate: Date) => {
    return db.collection(`/users`).add({
        ...userInfo,
        status: 'Pending',
        statusUpdatedAt: Date.now(),
        hireDate,
        teams: [],
    });
};

export const getCalloutList = (company: string) => {
    const users: IUser[] = [];
    let lastCallouts: any;
    return db
        .collection('/users')
        .where('company', '==', company)
        .where('role', '==', 'staff')
        .orderBy('hireDate', 'asc')
        .get()
        .then((userDocs) => {
            userDocs.forEach((doc) => {
                users.push(mapToUser(doc.id, doc.data()));
            });

            return db.collection(`/companies/${company}/last-callouts`).get();
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

export const formatFirestoreData = <T>(
    docs: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>,
    mapFunction: (id: string, data: any) => T
) => {
    const dataArray: T[] = [];

    docs.forEach((doc) => {
        dataArray.push(mapFunction(doc.id, doc.data()));
    });

    return dataArray;
};
