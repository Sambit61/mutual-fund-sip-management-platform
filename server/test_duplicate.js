const axios = require("axios");

async function testDuplicate() {
  try {
    const res = await axios.post("https://mutual-fund-sip-management-platform.onrender.com/api/auth/register", {
      name: "Test Deploy",
      email: "test1781633015900@test.com",
      password: "password123"
    });
    console.log("Success:", res.data);
  } catch (err) {
    console.error("Error:", err.response ? err.response.data : err.message);
  }
}

testDuplicate();
