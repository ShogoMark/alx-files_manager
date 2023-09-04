const redis = require('redis');
const util = require('util');

class RedisClient {
  constructor() {
    // Create the redis client
    this.client = redis.createClient();

    // Initialize a flag to track the connection status based on the client's status
    this.isConnected = true;

    this.getAsync = util.promisify(this.client.get).bind(this.client);
    this.setAsync = util.promisify(this.client.set).bind(this.client);
    this.delAsync = util.promisify(this.client.del).bind(this.client);

    // handle redis client errors
    this.client.on('error', (error) => {
      console.error('Redis client failed to connect:', error.message || error.toString());
      this.isConnected = false;
    });

    // set up handler for when connection is established
    this.client.on('connect', () => {
      console.log('Redis Connected Successfully!');
      this.isConnected = true;
    });
  }

  async isAlive() {
    // Ensure that the connection is established before checking the status
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
      await this.delAsync(key); // Corrected this line
    } catch (error) {
      console.error(error);
    }
  }
}

const redisClient = new RedisClient();

module.exports = redisClient;
