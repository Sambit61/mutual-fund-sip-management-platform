const mongoose = require("mongoose");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

async function runFlow() {
  await mongoose.connect("mongodb://127.0.0.1:27017/mutualfundDB");
  
  // 1. Create user
  let user = new User({
    name: "Flow Test",
    email: "flow@test.com",
    password: await bcrypt.hash("password123", 10)
  });
  await user.save();
  
  // 2. Forgot password
  const resetToken = crypto.randomBytes(32).toString("hex");
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
  await user.save();
  
  // 3. Reset password
  const foundUser = await User.findOne({ resetPasswordToken: resetToken });
  if (!foundUser) {
    console.log("ERROR: Token not found in database!");
  } else {
    console.log("SUCCESS: User found, token works!");
  }
  
  await User.deleteOne({ email: "flow@test.com" });
  await mongoose.disconnect();
}

runFlow().catch(console.error);
