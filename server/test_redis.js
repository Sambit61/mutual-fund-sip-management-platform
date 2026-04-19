const redis = require("redis");
const client = redis.createClient({ url: "redis://127.0.0.1:6379" });

client.on("error", (err) => console.log("error", err.message));

async function run() {
  console.log("isReady before connect:", client.isReady);
  client.connect().catch(e => console.log("connect catch", e.message));
  
  // wait 1 second
  await new Promise(r => setTimeout(r, 1000));
  console.log("isReady after 1s:", client.isReady);
  
  // let's try a command if we check isReady
  if (client.isReady) {
    console.log("trying get");
    await client.get("foo");
  } else {
    console.log("skipped get");
  }
  process.exit(0);
}
run();
