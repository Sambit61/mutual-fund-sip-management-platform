const axios = require("axios");

async function testLogin() {
  try {
    const res = await axios.post("https://mutual-fund-sip-management-platform.onrender.com/api/auth/login", {
      email: "test1781633015900@test.com",
      password: "password123"
    });
    console.log("Login Success:", res.data);
  } catch (err) {
    console.error("Login Error:", err.response ? err.response.data : err.message);
  }
}

testLogin();
