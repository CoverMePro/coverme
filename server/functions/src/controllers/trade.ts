import { Request, Response } from 'express';
import { ITradeRequest } from '../models/Trade';
import { db } from '../utils/admin';

const createTradeRequest = (req: Request, res: Response) => {
    const company = req.params.name;
    const tradeRequest: ITradeRequest = req.body;

    db.collection(`/companies/${company}/trade-requests`)
        .add(tradeRequest)
        .then((result) => {
            return result.get();
        })
        .then((resultdata) => {
            const tradeRequest: ITradeRequest = {
                id: resultdata.id,
                ...resultdata.data(),
            };
            return res.json({ message: 'Trade request created!', tradeRequest });
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
};

const getUserTradeRequest = (req: Request, res: Response) => {
    const { name, user } = req.params;

    let proposedTrades: ITradeRequest[] = [];
    let requestedTrades: ITradeRequest[] = [];
    let approvedTrades: ITradeRequest[] = [];
    let declinedTrades: ITradeRequest[] = [];

    db.collection(`/companies/${name}/trade-requests`)
        .where('proposedUser', '==', user)
        .get()
        .then((proposedRequestResults) => {
            proposedRequestResults.forEach((result) => {
                const tradeRequest: ITradeRequest = {
                    id: result.id,
                    ...result.data(),
                };

                if (tradeRequest.status === 'Manager Approved') {
                    approvedTrades.push(tradeRequest);
                } else if (
                    tradeRequest.status === 'Staff Rejected' ||
                    tradeRequest.status === 'Manager Denied'
                ) {
                    declinedTrades.push(tradeRequest);
                } else {
                    proposedTrades.push(tradeRequest);
                }
            });

            return db
                .collection(`/companies/${name}/trade-requests`)
                .where('requestedUser', '==', user)
                .get();
        })
        .then((requestedRequestResults) => {
            requestedRequestResults.forEach((result) => {
                const tradeRequest: ITradeRequest = {
                    id: result.id,
                    ...result.data(),
                };

                if (tradeRequest.status === 'Manager Approved') {
                    approvedTrades.push(tradeRequest);
                } else if (
                    tradeRequest.status === 'Staff Rejected' ||
                    tradeRequest.status === 'Manager Denied'
                ) {
                    declinedTrades.push(tradeRequest);
                } else {
                    requestedTrades.push(tradeRequest);
                }
            });

            return res.json({ approvedTrades, declinedTrades, proposedTrades, requestedTrades });
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
};

export default {
    createTradeRequest,
    getUserTradeRequest,
};
