const mongoose = require("mongoose");
const crypto = require("crypto");
const User = require("./models/User");

async function test() {
  await mongoose.connect("mongodb://127.0.0.1:27017/mutualfundDB");
  
  let user = await User.findOne();
  if (!user) {
    user = new User({ name: "Test", email: "test@test.com", password: "test" });
    await user.save();
  }
  
  console.log("User before:", user);

  const resetToken = crypto.randomBytes(32).toString("hex");
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
  
  await user.save();
  
  console.log("Token generated:", resetToken);
  
  const foundUser = await User.findOne({ resetPasswordToken: resetToken });
  console.log("User found by token:", foundUser ? "YES" : "NO");
  
  await mongoose.disconnect();
}

test().catch(console.error);
