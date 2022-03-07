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

export default {
    createTradeRequest,
};
