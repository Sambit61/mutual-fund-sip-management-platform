const redis = require("redis");

const client = redis.createClient({
  url: process.env.REDIS_URI || "redis://127.0.0.1:6379"
});

client.on("error", (error) => console.error(`Redis Error: ${error.message}`));
client.on("connect", () => console.log("Redis Connected"));

const redisClient = {
  connect: () => client.connect(),
  get: async (key) => {
    if (client.isReady) {
      try { return await client.get(key); } catch (e) { console.error("Redis get error:", e.message); }
    }
    return null;
  },
  setEx: async (key, time, value) => {
    if (client.isReady) {
      try { await client.setEx(key, time, value); } catch (e) { console.error("Redis setEx error:", e.message); }
    }
  },
  del: async (key) => {
    if (client.isReady) {
      try { await client.del(key); } catch (e) { console.error("Redis del error:", e.message); }
    }
  }
};

module.exports = redisClient;
