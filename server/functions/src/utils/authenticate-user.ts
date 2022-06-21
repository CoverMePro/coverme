import { fbAdmin } from "../utils/admin";
import { Request, Response, NextFunction } from "express";

export default async (req: Request, res: Response, next: NextFunction) => {
    if (!req.cookies) {
        console.log("no cookies");
        return res.status(401).send({ message: "Unauthorized" });
    }

    if (!req.cookies["__session"]) {
        console.log("no session cookies");
        return res.status(401).send({ message: "Unauthorized" });
    }

    console.log("Pass cookie check");

    const sessionCookie = `${req.cookies["__session"]}`;

    const result = await verifySessionCookie(sessionCookie);

    if (result) {
        return next();
    } else {
        return res.status(401).send({ message: "Unauthorized" });
    }
};

export const assignSessionCookie = (tokenId: string, expiresIn: number) => {
    return fbAdmin.auth().createSessionCookie(tokenId, { expiresIn });
};

export const verifySessionCookie = (sessionCookie: string) => {
    return fbAdmin.auth().verifySessionCookie(sessionCookie, true);
};
