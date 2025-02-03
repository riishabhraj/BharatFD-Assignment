import { createClient } from 'redis';
import { promisify } from 'util';
import dotenv from 'dotenv';

dotenv.config();

const redisClient = createClient({
    url: process.env.REDIS_URL
});

redisClient.on('error', (err: Error) => console.error('Redis Client Error:', err));
redisClient.on('connect', () => console.log('Redis Connected Successfully'));
redisClient.on('reconnecting', () => console.log('Redis Reconnecting...'));

// Initialize Redis connection
(async () => {
    await redisClient.connect();
})();

export const getAsync = promisify(redisClient.get).bind(redisClient);
export const setAsync = promisify(redisClient.set).bind(redisClient);
export const delAsync = promisify(redisClient.del).bind(redisClient);

// Add a function to close the Redis connection
export const closeRedisConnection = async () => {
    await redisClient.quit();
};

export default redisClient;
