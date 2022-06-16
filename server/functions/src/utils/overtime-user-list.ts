import { IUser } from "../models/User";
import { db } from "./admin";

export const getCalloutList = (company: string) => {
    const users: IUser[] = [];
    let lastCallouts: any;
    return db
        .collection("/users")
        .where("company", "==", company)
        .where("role", "==", "staff")
        .orderBy("hireDate", "asc")
        .get()
        .then((data) => {
            data.forEach((doc) => {
                users.push({
                    email: doc.id,
                    ...doc.data(),
                    hireDate: doc.data().hireDate.toDate(),
                    overtimeCalloutDate: doc.data().overtimeCalloutDate.toDate(),
                });
            });

            return db.collection(`/companies/${company}/last-callouts`).get();
        })
        .then((result) => {
            if (result.empty) {
                lastCallouts = undefined;
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
