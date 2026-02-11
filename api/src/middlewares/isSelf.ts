import type { NextFunction } from 'express';

export function verifyIsSelf(req: any, res: any, next: NextFunction) {
    const user_id = req.user.user_id;

    if(user_id == req.params.id){
        return next();
    }

    return res.status(401).json({ message: 'Route for account owner only' });
}