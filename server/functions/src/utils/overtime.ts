import { IOvertime, ICallout } from '../models/Overtime';
import { IShift } from '../models/Shift';
import { IUser } from '../models/User';
import { db } from './admin';
import { getCalloutList } from './overtime-user-list';

const userContainsTeam = (user: IUser, team: string) => {
    if (!user.teams || user.teams.length === 0) {
        return false;
    }

    return user.teams.findIndex((t) => t === team) !== -1;
};

const isInCallouts = (callouts: ICallout[], user: IUser) => {
    return callouts.findIndex(callout => callout.user === user.email) !== -1;
};

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

                    // Check if there is the correct data to do call out logic
                    if (
                        overtimeData &&
                        overtimeData.company &&
                        overtimeData.team &&
                        overtimeData.shiftId &&
                        overtimeData.shiftInfo
                    ) {
                        const { company, team, shiftId } = overtimeData;
                        // get shift information

                        // check if anyone accepted call out

                        const shiftdoc = await db
                            .doc(`/companies/${company}/shifts/${shiftId}`)
                            .get();

                        if (shiftdoc && shiftdoc.data()) {
                            // check if shit start time is in reasonable time to call out
                            // if not, notify shift has not been assigned
                            const shift: IShift = {
                                ...shiftdoc.data(),
                                id: shiftdoc.id,
                                startDateTime: shiftdoc.data()!.startDateTime.toDate(),
                                endDateTime: shiftdoc.data()!.endDateTime.toDate(),
                            };

                            
                            // method to calculate date within a certain time (1 hour)
 
                            const msBetweenDates = Math.abs(new Date().getTime() - (shift.startDateTime as Date).getTime());

                            // 👇️ convert ms to hours                  min  sec   ms
                            const hoursBetweenDates = msBetweenDates / (60 * 60 * 1000);

                            if (hoursBetweenDates < 2) {
                                // too close for call outs

                                // end callouts for this one
                            }

                            // get callout list information
                            const {users, lastCallouts} = await getCalloutList(company);

                            // check if all users are notified, if so then dont go through all this
                            if (users.length === callouts.length) {

                                // check if all users declined, then end this callout
                                return;
                            }


                            // check if its we are in internal or external callout phase
                            // TODO: Need some sort of phase property
                            if (!overtimeData.phase || overtimeData.phase === 'Internal') {
                                
                                const internalUsers = users.filter((user) => userContainsTeam(user, team));
                                // get index where last call out was made

                                const lastCalloutUserForTeam = lastCallouts[team];
                                let calloutindex = 0;

                                if (lastCalloutUserForTeam) {
                                    const userIndex = internalUsers.findIndex(user => {
                                        user.email = lastCalloutUserForTeam;
                                    });

                                    if (userIndex !== -1) {
                                        calloutindex = userIndex;
                                    }
                                }

                                // loop through and get next user for call out
                                while (callouts.length !== internalUsers.length) {
                                    const nextCalloutuser = internalUsers[calloutindex];

                                    if (isInCallouts(callouts, nextCalloutuser)) {
                                        continue;
                                    } else {
                                        // check if user can take shift ???


                                        // initiate callout
                                        callouts.push({
                                            user: nextCalloutuser.email!,
                                            team: 'internal',
                                            status: 'Pending'
                                        });

                                        return;
                                    }
                                }
                            } else {
                                
                                const lastCalloutUserForCompany = lastCallouts.external.email;
                                let calloutindex = 0;

                                if (lastCalloutUserForCompany) {
                                    const userIndex = users.findIndex(user => {
                                        user.email = lastCalloutUserForCompany;
                                    });

                                    if (userIndex !== -1) {
                                        calloutindex = userIndex;
                                    }
                                }

                                // loop through and get next user for call out
                                while (callouts.length !== users.length) {
                                    const nextCalloutuser = users[calloutindex];

                                    if (isInCallouts(callouts, nextCalloutuser)) {
                                        continue;
                                    } else {
                                              // check if user can take shift ???


                                        // initiate callout
                                        callouts.push({
                                            user: nextCalloutuser.email!,
                                            team: 'external',
                                            status: 'Pending'
                                        });

                                       return;
                                    }
                                }
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
