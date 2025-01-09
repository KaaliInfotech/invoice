const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: Number,
      required: [true, "Invoice number is required"],
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
      validate: {
        validator: (value) => value <= new Date(),
        message: "Date cannot be in the future"
      }
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0, "Amount cannot be negative"]
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }
  },
  { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);
module.exports = Payment;
