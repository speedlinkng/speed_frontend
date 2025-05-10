const Redis = require('ioredis');
const dotenv = require('dotenv');

dotenv.config();

const redisClient = new Redis(process.env.REDIS_PUBLIC_URL);

module.exports = redisClient;