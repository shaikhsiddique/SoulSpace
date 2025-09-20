const Redis = require('ioredis');
require('dotenv').config();

const redisClient = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD
});

redisClient.on('connect', () => {
  console.log("Redis connected");
});

redisClient.on('error', (err) => {
  console.error("Redis connection error:", err);
});

module.exports = redisClient;
