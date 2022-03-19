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
                shiftIds.findIndex((shift: string) => shift === tradeRequest.proposedShiftId) > -1
            ) {
                shiftIds.push();
            }

            if (
                shiftIds.findIndex((shift: string) => shift === tradeRequest.requestedShiftId) > -1
            ) {
                shiftIds.push();
            }

            tradeRequests.push(tradeRequest);
        });

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

        return res.json({ tradeRequests });
    } catch (err: any) {
        console.error(err);
        return res.status(500).json({ error: err });
    }
};

export default {
    createTradeRequest,
    getUserTradeRequest,
};
