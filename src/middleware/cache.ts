import { Request, Response, NextFunction } from 'express';
import { getAsync, setAsync } from '../config/redis';

export const cacheMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const lang = req.query.lang as string || 'en';
        const cacheKey = `faqs:${lang}`;

        const cachedData = await getAsync(cacheKey);

        if (cachedData) {
            res.json(JSON.parse(cachedData));
            return;
        }

        res.locals.cacheKey = cacheKey;
        next();
    } catch (error) {
        next(error);
    }
};

export const setCache = async (key: string, data: any, expiryInSeconds: number = 3600): Promise<void> => {
    await setAsync(key, JSON.stringify(data), 'EX', expiryInSeconds);
};
