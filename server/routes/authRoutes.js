const express = require("express");

const {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  getCurrentUser,
  changePassword,
  uploadProfilePicture,
  updateProfile
} = require(
  "../controllers/authController"
);

const upload =
  require(
    "../middleware/uploadMiddleware"
  );

const {
  protect
} = require(
  "../middleware/authMiddleware"
);

const router = express.Router();

router.post(
  "/register",
  registerUser
);

router.post(
  "/login",
  loginUser
);

router.post(
  "/forgot-password",
  forgotPassword
);

router.post(
  "/reset-password/:token",
  resetPassword
);

router.get(
  "/me",
  protect,
  getCurrentUser
);

router.put(
  "/change-password",
  protect,
  changePassword
);

router.put(
  "/update-profile",
  protect,
  updateProfile
);

router.post(
  "/upload-profile-picture",
  protect,
  upload.single("image"),
  uploadProfilePicture
);
module.exports = router;