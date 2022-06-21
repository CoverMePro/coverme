import { IOvertime, ICallout, mapToOvertime } from '../models/Overtime';
import { IShift, mapToShift } from '../models/Shift';
import { IUser } from '../models/User';
import { db } from './admin';
import { getCalloutList } from './db-helpers';

const userContainsTeam = (user: IUser, team: string) => {
    if (!user.teams || user.teams.length === 0) {
        return false;
    }

    return user.teams.findIndex((t) => t === team) !== -1;
};

const isInCallouts = (callouts: ICallout[], user: IUser) => {
    return callouts.findIndex((callout) => callout.user === user.email) !== -1;
};

const hasUserAcceptedCallout = async (
    callouts: ICallout[],
    overtimeData: IOvertime,
    team: string
) => {
    let hasAccepted = false;

    for (let i = 0, len = callouts.length; i < len; ++i) {
        const callout = callouts[i];

        if (callout.status === 'Accepted') {
            await db.doc(`/overtime-callouts/${overtimeData.id}`).update({
                shiftAcceptedBy: callout.user,
                status: 'Complete',
            });

            // assign shift here too
            await db
                .doc(`/companies/${overtimeData.company}/shifts/${overtimeData.shiftId}`)
                .update({
                    userId: callout.user,
                });

            if (callout.team === 'internal') {
                await db.doc(`/companies/${overtimeData.company}/last-callouts/internal`).update({
                    [team]: callout.user,
                });
            } else {
                await db.doc(`/companies/${overtimeData.company}/last-callouts/external`).update({
                    email: callout.user,
                });
            }

            hasAccepted = true;
        }
    }

    return hasAccepted;
};

const hasCalloutReachedShiftStartTimeRange = (shift: IShift, hourRange: number) => {
    const msBetweenDates = Math.abs(new Date().getTime() - (shift.startDateTime as Date).getTime());

    // 👇️ convert ms to hours                  min  sec   ms
    const hoursBetweenDates = msBetweenDates / (60 * 60 * 1000);

    if (hoursBetweenDates < hourRange) {
        // too close for call outs

        // end callouts for this one
        console.log(`WITHIN ${hourRange} HOURS!`);

        return true;
    }

    return false;
};

const hasReachedLimit = (array1: any[], array2: any[]) => {
    return array1.length === array2.length;
};

const hasAllUsersBeenNotifiedOrDeclined = (users: IUser[], callouts: ICallout[]) => {
    // check if all users are notified, if so then dont go through all this
    if (hasReachedLimit(users, callouts)) {
        console.log('ALL USERS NOTIFIED');
        // check if all users declined, then end this callout
        let allDeclined = true;

        callouts.forEach((callout) => {
            if (callout.status !== 'Rejected') {
                allDeclined = false;
            }
        });

        if (allDeclined) {
            // close the callout so it doesnt run anymore
        }

        return true;
    }

    return false;
};

const handleCalloutCycle = async (
    callouts: ICallout[],
    users: IUser[],
    lastCalloutUser: string,
    overtimeId: string,
    phase: 'internal' | 'external'
) => {
    let calloutindex = 0;

    console.log(users);

    if (lastCalloutUser) {
        console.log(lastCalloutUser);
        const userIndex = users.findIndex((user) => user.email === lastCalloutUser);

        console.log(userIndex);

        if (userIndex !== -1) {
            calloutindex = userIndex + 1 >= users.length ? 0 : userIndex + 1;
        }
    }

    // loop through and get next user for call out
    while (callouts.length !== users.length) {
        const nextCalloutuser = users[calloutindex];

        if (isInCallouts(callouts, nextCalloutuser)) {
            console.log('In callout!!!');
            calloutindex = calloutindex + 1 >= users.length ? 0 : calloutindex + 1;
            console.log(calloutindex);
            continue;
        } else {
            // check if user can take shift ???
            console.log(`CONTACTING ${nextCalloutuser.email}`);
            // initiate callout
            callouts.push({
                user: nextCalloutuser.email!,
                team: phase,
                status: 'Pending',
            });

            await db.doc(`/overtime-callouts/${overtimeId}`).update({
                callouts: [...callouts],
            });

            break;
        }
    }
};

const callout = () => {
    return db
        .collection('/overtime-callouts')
        .where('status', '==', 'Pending')
        .get()
        .then((calloutResult) => {
            if (calloutResult.empty) {
                console.log('NO CALLOUTS CURRENTLY');
                return;
            }

            calloutResult.forEach(async (overtimeCalloutDoc) => {
                try {
                    const overtimeData: IOvertime = mapToOvertime(
                        overtimeCalloutDoc.id,
                        overtimeCalloutDoc.data()
                    );
                    const callouts = overtimeData.callouts ? [...overtimeData.callouts] : [];

                    const { company, team, shiftId } = overtimeData;

                    const userAcceptedCallout = await hasUserAcceptedCallout(
                        callouts,
                        overtimeData,
                        team
                    );

                    if (userAcceptedCallout) {
                        return;
                    }

                    const shiftdoc = await db.doc(`/companies/${company}/shifts/${shiftId}`).get();

                    if (shiftdoc && shiftdoc.data()) {
                        // check if shit start time is in reasonable time to call out
                        // if not, notify shift has not been assigned
                        const shift: IShift = mapToShift(shiftdoc.id, shiftdoc.data());

                        // method to calculate date within a certain time (1 hour)
                        if (hasCalloutReachedShiftStartTimeRange(shift, 1)) {
                            // update status of shift

                            return;
                        }

                        // get callout list information
                        const { users, lastCallouts } = await getCalloutList(company);

                        // check if all users are notified, if so then dont go through all this
                        if (hasAllUsersBeenNotifiedOrDeclined(users, callouts)) {
                            return;
                        }

                        // check if its we are in internal or external callout phase
                        // TODO: Need some sort of phase property
                        if (!overtimeData.phase || overtimeData.phase === 'Internal') {
                            console.log('INTERNAL');
                            const internalUsers = users.filter((user) =>
                                userContainsTeam(user, team)
                            );
                            // get index where last call out was made
                            console.log(lastCallouts);

                            const lastCalloutUserForTeam = lastCallouts.internal[team];

                            await handleCalloutCycle(
                                callouts,
                                internalUsers,
                                lastCalloutUserForTeam,
                                overtimeData.id!,
                                'internal'
                            );

                            if (hasReachedLimit(callouts, internalUsers)) {
                                await db.doc(`/overtime-callouts/${overtimeData.id}`).update({
                                    phase: 'External',
                                });
                            }

                            return;
                        } else {
                            console.log('EXTERNAL');
                            const lastCalloutUserForCompany = lastCallouts.external.email;

                            await handleCalloutCycle(
                                callouts,
                                users,
                                lastCalloutUserForCompany,
                                overtimeData.id!,
                                'external'
                            );

                            if (hasReachedLimit(callouts, users)) {
                                await db.doc(`/overtime-callouts/${overtimeData.id}`).update({
                                    status: 'Complete',
                                });
                            }

                            return;
                        }
                    }
                    console.log('TEST END NO SHIFT');
                    return;
                } catch (err) {
                    console.error(err);
                    throw new Error();
                }
            });
            console.log('END HERE');
            return;
        })
        .catch((err) => {
            console.error(err);
            throw new Error(err);
        });
};

export default callout;
