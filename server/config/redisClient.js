import { createClient } from 'redis';

const redisClient = createClient();

redisClient.on('error', (err) => console.error('Redis Client Error', err));

await redisClient.connect(); // top-level await (only in ESM)

export default redisClient;
