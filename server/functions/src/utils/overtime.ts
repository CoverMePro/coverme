// import { IOvertime, ICallout } from '../models/Overtime';
// import { IShift } from '../models/Shift';
// import { db } from './admin';

// export const callout = () => {
//     db.collection('/overtime-callouts')
//         .where('status', '==', 'Pending')
//         .get()
//         .then((calloutResult) => {
//             if (calloutResult.empty) {
//                 console.log('NO CALLOUTS CURRENTLY');
//                 return;
//             }

//             calloutResult.forEach(async (calloutData) => {
//                 try {
//                     const overtimeData: IOvertime = calloutData.data();
//                     const callouts = overtimeData.callouts ? [...overtimeData.callouts] : [];

//                     // Check if there is the correct data to do call out logic
//                     if (
//                         overtimeData &&
//                         overtimeData.company &&
//                         overtimeData.team &&
//                         overtimeData.shiftId
//                     ) {
//                         const { company, team, shiftId } = overtimeData;
//                         // get shift information

//                         const shiftdoc = await db
//                             .doc(`/companies/${company}/shifts/${shiftId}`)
//                             .get();

//                         if (shiftdoc && shiftdoc.data()) {
//                             // check if shit start time is in reasonable time to call out
//                             // if not, notify shift has not been assigned
//                             const shift: IShift = {
//                                 ...shiftdoc.data(),
//                                 id: shiftdoc.id,
//                                 startDateTime: shiftdoc.data()!.startDateTime.toDate(),
//                                 endDateTime: shiftdoc.data()!.endDateTime.toDate(),
//                             };

//                             // method to calculate date within a certain time (1 hour)
//                         }

//                         // get callout list information

//                         // if all team members not notfied...
//                         // copy list and filter just team and sort on hire date

//                         // get current index for team and begin call out

//                         // if all team members were notified
//                         // go to primary list and start at primary index
//                         // if part of team, skip
//                         // once go through entire list, notfiy not been assigned

//                         // NOTE check if user has any shift within 8 hours of this shift

//                         const teamDoc = await db
//                             .doc(`/companies/${overtimeData.company}/teams/${overtimeData.team}`)
//                             .get();

//                         if (teamDoc && teamDoc.data()) {
//                             const users: string[] = teamDoc.data()!.staff
//                                 ? teamDoc.data()!.staff
//                                 : [];

//                             for (let i = 0, len = users.length; i < len; i++) {
//                                 // is user in callout list?

//                                 console.log('checking user ' + users[i]);

//                                 callouts.forEach(async (callout) => {
//                                     try {
//                                         if (callout.user === users[i]) {
//                                             if (callout.status === 'Accepted') {
//                                                 // if accepted, assign shift to this user and move them to end of team list
//                                                 console.log('USER ACCEPTED CALLOUT');
//                                                 await db
//                                                     .doc(
//                                                         `/companies/${overtimeData.company}/shifts/${overtimeData.shiftId}`
//                                                     )
//                                                     .update({
//                                                         userId: users[i],
//                                                     });

//                                                 await db
//                                                     .doc(`/overtime-callouts/${calloutData.id}`)
//                                                     .update({
//                                                         status: 'Assigned',
//                                                     });
//                                                 return;
//                                             }
//                                         }
//                                     } catch (err) {
//                                         console.error(err);
//                                     }
//                                 });

//                                 if (callouts.length === users.length) {
//                                     console.log('OVERTIME CALLOUT FAILED');
//                                     await db.doc(`/overtime-callouts/${calloutData.id}`).update({
//                                         status: 'UnAssigned',
//                                     });
//                                 } else {
//                                     console.log('NEW CALLOUT TO USER');
//                                     const newCallout: ICallout = {
//                                         user: users[i],
//                                         status: 'Pending',
//                                         rank: i,
//                                         team: teamDoc.id,
//                                     };

//                                     callouts.push(newCallout);

//                                     await db.doc(`/overtime-callouts/${calloutData.id}`).update({
//                                         callouts: [...callouts],
//                                     });
//                                 }

//                                 // reach out to user and add to callout
//                                 return;
//                             }
//                         }
//                     }
//                 } catch (err) {
//                     console.error(err);
//                 }
//             });
//         })
//         .catch((err) => {
//             console.error(err);
//         });
// };
