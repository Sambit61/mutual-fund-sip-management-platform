const mongoose = require("mongoose");
const User = require("./models/User");

async function dump() {
  await mongoose.connect("mongodb://127.0.0.1:27017/mutualfundDB");
  
  const users = await User.find({ resetPasswordToken: { $exists: true } });
  console.log("Users with reset token:", users.map(u => ({ id: u._id, email: u.email, token: u.resetPasswordToken })));
  
  await mongoose.disconnect();
}

dump().catch(console.error);
