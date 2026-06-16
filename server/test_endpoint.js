const axios = require("axios");

async function test() {
  try {
    const res = await axios.post("http://localhost:5000/api/auth/reset-password/db9770c0ec5567b330480f094fa0413aee946f2755f1c92940e0082012d920bc", { password: "newpassword" });
    console.log("Success:", res.data);
  } catch (err) {
    console.error("Error:", err.response?.data || err.message);
  }
}

test();
