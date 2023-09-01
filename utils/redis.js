const redis = require('redis');


class RedisClient {
  constructor() {
    this.client = redis.createClient();

    // initialize a flag to track the connection status	  
    this.isConnected = false;
   
    // handle redis client errors	  
    this.client.on('error', (error) => {
      console.error(error);
      this.isConnected = false;
    });

    // set up handler for when connection is established
    this.client.on('connect', () => {
      this.isConnected = true;
    });

  isAlive() {
    return this.isConnected;
  }

  async get(key) {
    try {
      const value = await this.getAsync(key);
      return value;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async set(key, value, timeInSec) {
    try {
      const result = await this.setAsync(key, value, 'EX', timeInSec);
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
 }

  async del(key) {
  try {
    await this.del(key);
  } catch (error) {
    console.error(error);
  }
 }
}

redisClient = RedisClient()
