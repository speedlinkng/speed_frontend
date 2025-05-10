const Redis = require('ioredis');
const dotenv = require('dotenv');

dotenv.config();

const redisClient = new Redis('redis://default:gWSYLKZdGRaLhedkjlOUmabtWIMDntxv@hopper.proxy.rlwy.net:58345');

module.exports = redisClient;