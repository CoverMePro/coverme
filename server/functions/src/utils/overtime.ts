import { IOvertime, ICallout } from '../models/Overtime';
import { db } from './admin';

export const callout = () => {
    db.collection('/overtime-callouts')
        .where('status', '==', 'Pending')
        .get()
        .then((calloutResult) => {
            if (calloutResult.empty) {
                console.log('NO CALLOUTS CURRENTLY');
                return;
            }

            calloutResult.forEach(async (calloutData) => {
                try {
                    const overtimeData: IOvertime = calloutData.data();
                    const callouts = overtimeData.callouts ? [...overtimeData.callouts] : [];

                    if (overtimeData && overtimeData.company && overtimeData.team) {
                        const teamDoc = await db
                            .doc(`/companies/${overtimeData.company}/teams/${overtimeData.team}`)
                            .get();

                        if (teamDoc && teamDoc.data()) {
                            const users: string[] = teamDoc.data()!.staff
                                ? teamDoc.data()!.staff
                                : [];

                            for (let i = 0, len = users.length; i < len; i++) {
                                // is user in callout list?

                                console.log('checking user ' + users[i]);

                                callouts.forEach(async (callout) => {
                                    try {
                                        if (callout.user === users[i]) {
                                            if (callout.status === 'Accepted') {
                                                // if accepted, assign shift to this user and move them to end of team list
                                                console.log('USER ACCEPTED CALLOUT');
                                                await db
                                                    .doc(
                                                        `/companies/${overtimeData.company}/shifts/${overtimeData.shiftId}`
                                                    )
                                                    .update({
                                                        userId: users[i],
                                                    });

                                                await db
                                                    .doc(`/overtime-callouts/${calloutData.id}`)
                                                    .update({
                                                        status: 'Assigned',
                                                    });
                                                return;
                                            }
                                        }
                                    } catch (err) {
                                        console.error(err);
                                    }
                                });

                                if (callouts.length === users.length) {
                                    console.log('OVERTIME CALLOUT FAILED');
                                    await db.doc(`/overtime-callouts/${calloutData.id}`).update({
                                        status: 'UnAssigned',
                                    });
                                } else {
                                    console.log('NEW CALLOUT TO USER');
                                    const newCallout: ICallout = {
                                        user: users[i],
                                        status: 'Pending',
                                        rank: i,
                                        team: teamDoc.id,
                                    };

                                    callouts.push(newCallout);

                                    await db.doc(`/overtime-callouts/${calloutData.id}`).update({
                                        callouts: [...callouts],
                                    });
                                }

                                // reach out to user and add to callout
                                return;
                            }
                        }
                    }
                } catch (err) {
                    console.error(err);
                }
            });
        })
        .catch((err) => {
            console.error(err);
        });
};
