const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    res.status(201).json({
      message: "User registered successfully",
      user
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d"
      }
    );

    res.json({
      message: "Login successful",
      token,
      role: user.role
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.forgotPassword = async (req, res) => {

  try {

    const { email } = req.body;

    const user = await User.findOne({
      email
    });

    if (!user) {

      return res.status(404).json({
        message: "User not found"
      });

    }

    const resetToken =
      crypto.randomBytes(32)
      .toString("hex");

    user.resetPasswordToken =
      resetToken;

    user.resetPasswordExpires =
      Date.now() + 15 * 60 * 1000;

    await user.save();

    const resetUrl =
      `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    await transporter.sendMail({

      from:
        process.env.EMAIL_USER,

      to:
        user.email,

      subject:
        "MutualSIP Password Reset",

      html: `
        <h2>Password Reset Request</h2>

        <p>
          Click the link below to reset your password:
        </p>

        <a href="${resetUrl}">
          Reset Password
        </a>

        <p>
          This link expires in 15 minutes.
        </p>
      `

    });

    res.json({
      message:
        "Password reset email sent"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message:
        "Failed to send reset email"
    });

  }

};

exports.resetPassword = async (req, res) => {

  try {

    const { token } = req.params;

    const { password } = req.body;

    const cleanToken = token.trim();

    // Make the token search case-insensitive just in case the client altered it
    const user = await User.findOne({
      resetPasswordToken: new RegExp(`^${cleanToken}$`, "i")
    });

    if (!user) {
      return res.status(400).json({
        message: "Token not found in database. It may be expired, already used, or invalid."
      });
    }

    if (
      user.resetPasswordExpires <
      new Date()
    ) {

      return res.status(400).json({
        message: "Token expired"
      });

    }

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    user.password =
      hashedPassword;

    user.resetPasswordToken =
      undefined;

    user.resetPasswordExpires =
      undefined;

    await user.save();

    res.json({
      message:
        "Password reset successful"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error"
    });

  }

};