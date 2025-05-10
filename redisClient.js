const Redis = require('ioredis');
const dotenv = require('dotenv');

dotenv.config();

const redisClient = new Redis('redis://default:gWSYLKZdGRaLhedkjlOUmabtWIMDntxv@redis.railway.internal:6379');

module.exports = redisClient;