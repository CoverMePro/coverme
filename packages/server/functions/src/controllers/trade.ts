import { Request, Response } from 'express';
import { mapToShift } from '../models/Shift';
import { ITradeRequest, mapToTradeRequest } from '../models/Trade';
import { db } from '../utils/admin';

const createTradeRequest = (req: Request, res: Response) => {
    const tradeRequest: ITradeRequest = req.body;

    let fetchedTradeRequest: ITradeRequest;

    tradeRequest.proposedDate = new Date(tradeRequest.proposedDate!);

    db.collection(`/trade-requests`)
        .add(tradeRequest)
        .then((result) => {
            return result.get();
        })
        .then((tradeRequestDoc) => {
            fetchedTradeRequest = mapToTradeRequest(tradeRequestDoc.id, tradeRequestDoc.data());

            return db
                .collection(`/shifts`)
                .where('__name__', 'in', [
                    tradeRequest.proposedShiftId,
                    tradeRequest.requestedShiftId,
                ])
                .get();
            //
        })
        .then((shiftDocs) => {
            shiftDocs.forEach((shiftDoc) => {
                if (fetchedTradeRequest.proposedShiftId === shiftDoc.id) {
                    fetchedTradeRequest.proposedShift = mapToShift(shiftDoc.id, shiftDoc.data());
                }

                if (fetchedTradeRequest.requestedShiftId === shiftDoc.id) {
                    fetchedTradeRequest.requestedShift = mapToShift(shiftDoc.id, shiftDoc.data());
                }
            });

            return res.json({
                message: 'Trade request created!',
                tradeRequest: fetchedTradeRequest,
            });
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
};

const getUserTradeRequest = async (req: Request, res: Response) => {
    const user = req.params.user;

    let tradeRequests: ITradeRequest[] = [];
    const shiftIds: string[] = [];
    try {
        const proposedTrades = db
            .collection(`/trade-requests`)
            .where('proposedUserId', '==', user)
            .get();

        const requestedTrades = db
            .collection(`/trade-requests`)
            .where('requestedUserId', '==', user)
            .get();

        const [proposedTradeSnapshot, requestedTradesSnapshot] = await Promise.all([
            proposedTrades,
            requestedTrades,
        ]);

        const tradeRequestDocs = proposedTradeSnapshot.docs.concat(requestedTradesSnapshot.docs);

        tradeRequestDocs.forEach((tradeRequestDoc) => {
            const tradeRequest: ITradeRequest = mapToTradeRequest(
                tradeRequestDoc.id,
                tradeRequestDoc.data()
            );

            if (
                shiftIds.findIndex((shift: string) => shift === tradeRequest.proposedShiftId) === -1
            ) {
                shiftIds.push(tradeRequest.proposedShiftId!);
            }

            if (
                shiftIds.findIndex((shift: string) => shift === tradeRequest.requestedShiftId) ===
                -1
            ) {
                shiftIds.push(tradeRequest.requestedShiftId!);
            }

            tradeRequests.push(tradeRequest);
        });

        if (shiftIds.length > 0) {
            const shiftSnapshot = await db
                .collection(`/shifts`)
                .where('__name__', 'in', shiftIds)
                .get();

            shiftSnapshot.docs.forEach((shiftDoc) => {
                for (let i = 0, len = tradeRequests.length; i < len; ++i) {
                    const tradeRequest = tradeRequests[i];

                    if (tradeRequest.proposedShiftId === shiftDoc.id) {
                        tradeRequest.proposedShift = mapToShift(shiftDoc.id, shiftDoc.data());
                    }

                    if (tradeRequest.requestedShiftId === shiftDoc.id) {
                        tradeRequest.requestedShift = mapToShift(shiftDoc.id, shiftDoc.data());
                    }
                }
            });
        }

        tradeRequests = tradeRequests.sort((a, b) => {
            return new Date(b.proposedDate!).getTime() - new Date(a.proposedDate!).getTime();
        });

        return res.json({ tradeRequests });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err });
    }
};

const getTradeRequestsFromTeam = (req: Request, res: Response) => {
    const teams = req.body.teams;

    let users: string[] = [];

    let tradeRequests: ITradeRequest[] = [];
    const shiftIds: string[] = [];

    db.collection(`/teams`)
        .where('__name__', 'in', teams)
        .get()
        .then(async (teamResult) => {
            teamResult.forEach((team) => {
                const teamData = team.data();

                if (teamData.staff) {
                    users = [...users, ...teamData.staff];
                }
            });

            try {
                const tradeRequestDocs = await db
                    .collection(`/trade-requests`)
                    .where('proposedUserId', 'in', users)
                    .get();

                tradeRequestDocs.forEach((tradeRequestDoc) => {
                    const tradeRequest: ITradeRequest = mapToTradeRequest(
                        tradeRequestDoc.id,
                        tradeRequestDoc.data()
                    );

                    if (
                        shiftIds.findIndex(
                            (shift: string) => shift === tradeRequest.proposedShiftId
                        ) === -1
                    ) {
                        shiftIds.push(tradeRequest.proposedShiftId!);
                    }

                    if (
                        shiftIds.findIndex(
                            (shift: string) => shift === tradeRequest.requestedShiftId
                        ) === -1
                    ) {
                        shiftIds.push(tradeRequest.requestedShiftId!);
                    }

                    tradeRequests.push(tradeRequest);
                });

                if (shiftIds.length > 0) {
                    const shiftSnapshot = await db
                        .collection(`/shifts`)
                        .where('__name__', 'in', shiftIds)
                        .get();

                    shiftSnapshot.docs.forEach((shiftDoc) => {
                        for (let i = 0, len = tradeRequests.length; i < len; ++i) {
                            const tradeRequest = tradeRequests[i];

                            if (tradeRequest.proposedShiftId === shiftDoc.id) {
                                tradeRequest.proposedShift = mapToShift(
                                    shiftDoc.id,
                                    shiftDoc.data()
                                );
                            }

                            if (tradeRequest.requestedShiftId === shiftDoc.id) {
                                tradeRequest.requestedShift = mapToShift(
                                    shiftDoc.id,
                                    shiftDoc.data()
                                );
                            }
                        }
                    });
                }

                tradeRequests = tradeRequests.sort((a, b) => {
                    return (
                        new Date(b.proposedDate!).getTime() - new Date(a.proposedDate!).getTime()
                    );
                });

                return res.json({ tradeRequests: tradeRequests });
            } catch (err) {
                console.error(err);
                return res.status(500).json({ error: err });
            }
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
};

const deleteTradeRequest = (req: Request, res: Response) => {
    const id = req.params.id;

    db.doc(`/trade-requests/${id}`)
        .delete()
        .then(() => {
            return res.json({ message: 'trade request deleted.' });
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
};

const acceptTradeRequest = async (req: Request, res: Response) => {
    const id = req.params.id;

    try {
        const tradeRequestDoc = await db.doc(`/trade-requests/${id}`).get();

        const tradeRequest: ITradeRequest = mapToTradeRequest(
            tradeRequestDoc.id,
            tradeRequestDoc.data()
        );

        const shift1Update = db.doc(`/shifts/${tradeRequest.proposedShiftId}`).update({
            userId: tradeRequest.requestedUserId,
        });

        const shift2Update = db.doc(`/shifts/${tradeRequest.requestedShiftId}`).update({
            userId: tradeRequest.proposedUserId,
        });

        const tradeRequestUpdate = db.doc(`/trade-requests/${id}`).update({
            status: 'Approved',
        });

        await Promise.all([shift1Update, shift2Update, tradeRequestUpdate]);

        return res.json({ message: 'trade has been made successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err });
    }
};

const rejectTradeRequest = (req: Request, res: Response) => {
    const id = req.params.id;

    db.doc(`/trade-requests/${id}`)
        .update({
            status: 'Rejected',
        })
        .then(() => {
            return res.json({ message: 'trade request rejectred.' });
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
};

const archiveTradeRequest = (req: Request, res: Response) => {
    const id = req.params.id;

    db.doc(`/trade-requests/${id}`)
        .get()
        .then((tradeRequestResults) => {
            let tradeRequestData = tradeRequestResults.data();

            if (tradeRequestData) {
                if (tradeRequestData.archiveUsers) {
                    tradeRequestData.archiveUsers.push(req.body.user);
                } else {
                    tradeRequestData.archiveUsers = [req.body.user];
                }
            }

            return db.doc(`/trade-requests/${id}`).set(tradeRequestData!);
        })
        .then(() => {
            return res.json({ message: 'archived successfully' });
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
};

export default {
    createTradeRequest,
    getUserTradeRequest,
    deleteTradeRequest,
    acceptTradeRequest,
    rejectTradeRequest,
    archiveTradeRequest,
    getTradeRequestsFromTeam,
};
