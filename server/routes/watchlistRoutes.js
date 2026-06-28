const express = require("express");
const router = express.Router();

const Watchlist = require("../models/Watchlist");

const { protect } = require("../middleware/authMiddleware");

router.post("/add", protect, async (req, res) => {
  try {
    const { symbol, type } = req.body;

    const exists = await Watchlist.findOne({
      user: req.user.id,
      symbol,
    });

    if (exists) {
      return res.status(400).json({
        message: "Already in watchlist",
      });
    }

    const item = await Watchlist.create({
      user: req.user.id,
      symbol,
      type,
    });

    res.json(item);
  } catch (err) {
    res.status(500).json({
      message: "Error adding watchlist item",
    });
  }
});

router.get("/", protect, async (req, res) => {
  try {
    const items = await Watchlist.find({
      user: req.user.id,
    });

    res.json(items);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching watchlist",
    });
  }
});

router.delete("/:id", protect, async (req, res) => {
  try {
    await Watchlist.findByIdAndDelete(req.params.id);

    res.json({
      message: "Removed from watchlist",
    });
  } catch (err) {
    res.status(500).json({
      message: "Error deleting item",
    });
  }
});
module.exports = router;
