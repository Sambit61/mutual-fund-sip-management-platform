const express = require('express');
const app = express();
const redis = require("redis");
const client = redis.createClient({ url: "redis://127.0.0.1:6379" });

client.on("error", (err) => console.log("error", err.message));
client.connect().catch(e => console.log("connect catch", e.message));

app.get('/api/funds', async (req, res) => {
  console.log("endpoint hit");
  let cached = null;
  if (client.isReady) {
    cached = await client.get("funds").catch(e => null);
  }
  console.log("cached is", cached);
  res.json([]);
});

app.listen(3001, () => {
  console.log("listening on 3001");
});
