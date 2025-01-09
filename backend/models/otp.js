const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  email: { type: String},
  firstname: { type: String},
  password: { type: String},
  otp: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

const OTP = mongoose.model('OTP', otpSchema);
module.exports = OTP;
