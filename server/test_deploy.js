const axios = require("axios");

async function test() {
  try {
    const res = await axios.post("https://mutual-fund-sip-management-platform.onrender.com/api/auth/register", {
      name: "Test Deploy",
      email: `test${Date.now()}@test.com`,
      password: "password123"
    });
    console.log("Success:", res.data);
  } catch (err) {
    console.error("Error:", err.response ? err.response.data : err.message);
  }
}

test();
