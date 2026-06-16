const axios = require("axios");

async function testCorsLocal() {
  try {
    const res = await axios.options("https://mutual-fund-sip-management-platform.onrender.com/api/auth/register", {
      headers: {
        Origin: "http://localhost:5173",
        "Access-Control-Request-Method": "POST"
      }
    });
    console.log("CORS Success (localhost):", res.headers['access-control-allow-origin'] || 'Header missing');
  } catch (err) {
    console.error("CORS Error:", err.message);
  }
}

testCorsLocal();
