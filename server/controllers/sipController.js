const SIP = require("../models/SIP");

exports.createSIP = async (req, res) => {
  try {

    const { fundId, amount, startDate } = req.body;

    const sip = await SIP.create({
      investor: req.user._id,
      fund: fundId,
      amount,
      startDate,
      nextRun: startDate
    });

    res.status(201).json(sip);

  } catch (error) {
    res.status(500).json({ message: "Error creating SIP" });
  }
};