const axios = require("axios");

async function testCors() {
  try {
    const res = await axios.options("https://mutual-fund-sip-management-platform.onrender.com/api/auth/register", {
      headers: {
        Origin: "https://mutual-fund-sip-management-platform.vercel.app",
        "Access-Control-Request-Method": "POST"
      }
    });
    console.log("CORS Success:", res.headers);
  } catch (err) {
    console.error("CORS Error:", err.message);
  }
}

testCors();
