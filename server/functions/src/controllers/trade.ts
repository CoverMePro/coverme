import { Request, Response } from 'express';
import { ITradeRequest } from '../models/Trade';
import { db } from '../utils/admin';

const createTradeRequest = (req: Request, res: Response) => {
    const company = req.params.name;
    const tradeRequest: ITradeRequest = req.body;

    let fetchedTradeRequest: ITradeRequest;

    db.collection(`/companies/${company}/trade-requests`)
        .add(tradeRequest)
        .then((result) => {
            return result.get();
        })
        .then((resultdata) => {
            fetchedTradeRequest = {
                id: resultdata.id,
                ...resultdata.data(),
            };

            return db
                .collection(`/companies/${company}/shifts`)
                .where('__name__', 'in', [
                    tradeRequest.proposedShiftId,
                    tradeRequest.requestedShiftId,
                ])
                .get();
            //
        })
        .then((shiftdocs) => {
            shiftdocs.forEach((shiftDoc) => {
                if (fetchedTradeRequest.proposedShiftId === shiftDoc.id) {
                    fetchedTradeRequest.proposedShift = {
                        ...shiftDoc.data(),
                    };
                }

                if (fetchedTradeRequest.requestedShiftId === shiftDoc.id) {
                    fetchedTradeRequest.requestedShift = {
                        ...shiftDoc.data(),
                    };
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
    const { name, user } = req.params;

    let tradeRequests: ITradeRequest[] = [];
    const shiftIds: string[] = [];
    try {
        const proposedTrades = db
            .collection(`/companies/${name}/trade-requests`)
            .where('proposedUser', '==', user)
            .get();

        const requestedTrades = db
            .collection(`/companies/${name}/trade-requests`)
            .where('requestedUser', '==', user)
            .get();

        const [proposedTradeSnapshot, requestedTradesSnapshot] = await Promise.all([
            proposedTrades,
            requestedTrades,
        ]);

        const tradeRequestDocs = proposedTradeSnapshot.docs.concat(requestedTradesSnapshot.docs);

        tradeRequestDocs.forEach((tradeRequestdoc) => {
            const tradeRequest: ITradeRequest = {
                id: tradeRequestdoc.id,
                ...tradeRequestdoc.data(),
            };

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
                .collection(`/companies/${name}/shifts`)
                .where('__name__', 'in', shiftIds)
                .get();

            shiftSnapshot.docs.forEach((shiftDoc) => {
                for (let i = 0, len = tradeRequests.length; i < len; ++i) {
                    const tradeRequest = tradeRequests[i];

                    if (tradeRequest.proposedShiftId === shiftDoc.id) {
                        tradeRequest.proposedShift = {
                            ...shiftDoc.data(),
                        };
                    }

                    if (tradeRequest.requestedShiftId === shiftDoc.id) {
                        tradeRequest.requestedShift = {
                            ...shiftDoc.data(),
                        };
                    }
                }
            });
        }

        return res.json({ tradeRequests });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err });
    }
};

const deleteTradeRequest = (req: Request, res: Response) => {
    const { name, id } = req.params;

    console.log(id);

    db.doc(`/companies/${name}/trade-requests/${id}`)
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
    const { name, id } = req.params;

    try {
        const tradeRequestSnapshot = await db.doc(`/companies/${name}/trade-requests/${id}`).get();

        const tradeRequest: ITradeRequest = {
            id: tradeRequestSnapshot.id,
            ...tradeRequestSnapshot.data(),
        };

        const shift1Update = db
            .doc(`/companies/${name}/shifts/${tradeRequest.proposedShiftId}`)
            .update({
                userId: tradeRequest.requestedUser,
            });

        const shift2Update = db
            .doc(`/companies/${name}/shifts/${tradeRequest.requestedShiftId}`)
            .update({
                userId: tradeRequest.proposedUser,
            });

        const tradeRequestUpdate = db.doc(`/companies/${name}/trade-requests/${id}`).update({
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
    const { name, id } = req.params;

    db.doc(`/companies/${name}/trade-requests/${id}`)
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

export default {
    createTradeRequest,
    getUserTradeRequest,
    deleteTradeRequest,
    acceptTradeRequest,
    rejectTradeRequest,
};
