const User = require("../models/User");

const MutualFund = require("../models/MutualFund");

const Transaction = require("../models/Transaction");

// ✅ ADMIN ANALYTICS

exports.getAdminStats = async (req, res) => {

  try {

    // TOTAL USERS

    const totalUsers =
      await User.countDocuments();

    // TOTAL FUNDS

    const totalFunds =
      await MutualFund.countDocuments();

    // TOTAL TRANSACTIONS

    const totalTransactions =
      await Transaction.countDocuments();

    // TOTAL INVESTMENT AMOUNT

    const investments =
      await Transaction.find();

    console.log(investments);

    const totalInvestmentAmount =
      investments.reduce(
        (sum, item) =>
          sum + Number(item.amount),
        0
      );

    // RESPONSE

    res.json({
      totalUsers,
      totalFunds,
      totalTransactions,
      totalInvestmentAmount
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message:
        "Error fetching admin stats"
    });

  }

};

// ✅ GET ALL TRANSACTIONS

exports.getAllTransactions = async (
  req,
  res
) => {

  try {

    const transactions =
      await Transaction.find()
        .sort({ createdAt: -1 });

    res.json(transactions);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message:
        "Error fetching transactions"
    });

  }

};

// ✅ GET ALL USERS

exports.getAllUsers = async (
  req,
  res
) => {

  try {

    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.json(users);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message:
        "Error fetching users"
    });

  }

};

// ✅ MAKE USER ADMIN

exports.makeAdmin = async (
  req,
  res
) => {

  try {

    const user = await User.findById(
      req.params.id
    );

    // USER NOT FOUND

    if (!user) {

      return res.status(404).json({
        message: "User not found"
      });

    }

    // ALREADY ADMIN

    if (user.role === "admin") {

      return res.status(400).json({
        message:
          "User is already admin"
      });

    }

    // UPDATE ROLE

    user.role = "admin";

    await user.save();

    res.json({
      message:
        "User promoted to admin"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message:
        "Error updating role"
    });

  }

};