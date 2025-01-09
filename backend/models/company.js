const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
    minlength: [3, "Name must be at least 3 characters long"],
    maxlength: [50, "Name must not exceed 50 characters"]
  },
  mobileNumber: {
    type: String,
    required: [true, "Mobile number is required"],
    validate: {
      validator: function (v) {
        return /^\d{10}$/.test(v);
      },
      message: "Invalid mobile number format. It must be 10 digits."
    }
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: "Invalid email format"
    }
  },
  address: {
    type: String,
    required: [true, "Address is required"],
    trim: true,
    minlength: [6, "Address must be at least 6 characters long"],
    maxlength: [100, "Address must not exceed 100 characters"]
  }
});

const Company = mongoose.model("Company", companySchema);

module.exports = Company;
