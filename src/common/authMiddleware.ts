import { Request, Response, NextFunction } from "express";


const ADMIN_AUTH ='admin:qwerty';

export const authMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const authHeader = req.headers.authorization || req.headers['authorization'];

    if (typeof authHeader !== 'string' || !authHeader.startsWith('Basic')) {
        res.sendStatus(401);
        return;
    }

    try {
        const base64 = authHeader.split('')[1];
        const credentials = Buffer.from(base64, 'base64').toString('utf-8');
        const [login, password] = credentials.split(':');

        if (login === 'admin' && password === 'qwerty') {
            next();
        } else {
            res.sendStatus(401)
        }
    }catch (e) {
        res.sendStatus(401)
    }
};