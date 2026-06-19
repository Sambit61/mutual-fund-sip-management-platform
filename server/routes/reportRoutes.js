const express =
  require("express");

const {
  protect
} = require(
  "../middleware/authMiddleware"
);

const {
  downloadPortfolioReport
} = require(
  "../controllers/reportController"
);

const router =
  express.Router();

router.get(
  "/portfolio-report",
  protect,
  downloadPortfolioReport
);

module.exports =
  router;