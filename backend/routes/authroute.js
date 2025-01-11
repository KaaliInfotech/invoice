const express = require("express");
const {
  signup,
  login,
  resetpassword,
  verifyOtp,
  resetpasswordOtp,
  verifyOtpAndResetPassword,
  signinWithGoogle,
  instagramDownloader,
  youtubeDownloader,
  newPayment,
  checkStatus,
} = require("../controller/authController");
const authenticate = require("../middleware/token");

const router = express.Router();

router.post("/signup", signup);
router.post("/verifyOtp", verifyOtp);
router.post("/login", login);
router.post("/signinWithGoogle", signinWithGoogle);
router.post("/resetpasswordOtp", authenticate, resetpasswordOtp);
router.post(
  "/verifyOtpAndresetpassword",
  authenticate,
  verifyOtpAndResetPassword
);
router.post("/resetpassword", authenticate, resetpassword);
router.get("/instagramDownloader", instagramDownloader);
router.get("/youtubeDownloader", youtubeDownloader);
router.post("/phonepe", newPayment);
router.post("/status", checkStatus);
module.exports = router;
