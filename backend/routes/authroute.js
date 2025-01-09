const express = require("express");
const { signup, login, resetpassword, verifyOtp, resetpasswordOtp, verifyOtpAndResetPassword, signinWithGoogle, Phonepe } = require("../controller/authController");
const authenticate = require("../middleware/token");

const router = express.Router();

router.post("/signup", signup);
router.post("/verifyOtp", verifyOtp);
router.post("/login", login);
router.post("/signinWithGoogle", signinWithGoogle);
router.post("/resetpasswordOtp", authenticate, resetpasswordOtp);
router.post("/verifyOtpAndresetpassword", authenticate,verifyOtpAndResetPassword);
router.post("/resetpassword", authenticate,resetpassword);
router.get("/phonepe", Phonepe);

module.exports = router;
