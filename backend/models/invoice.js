const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema(
  {
    logo: String,
    companyDetails: {
      // from: String,
      customerName: String,
      shipTo: String,
    },
    invoiceDetails: {
      invoiceNumber: Number,
      date: Date,
      dueDate: Date,
      phoneNumber: Number,
    },
    items: [
      {
        name: String,
        quantity: Number,
        rate: Number,
        amount: Number,
        _id: mongoose.Schema.Types.ObjectId,
      },
    ],
    summary: {
      subtotal: Number,
      tax: Number,
      discount: Number,
      shipping: Number,
      total: Number,
      amountPaid: Number,
      balanceDue: Number,
    },
    notes: String,
    terms: String,
    signlogo: String,
    currency: String,
    paymentStatus: {
      type: String,
      enum: ["paid", "pending", "overdue"],
      default: "pending",
    },
    paymentType: {
      type: String,
      enum: ["cash", "gpay", "other"],
      default: "other",
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    company_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      default: null,
    }
  },
  { timestamps: true }
);

// invoiceSchema.pre("save", async function (next) {
//   const latestInvoice = await mongoose.model('Invoice').findOne().sort({ invoiceDetails: -1 });

//   this.invoiceDetails.invoiceNumber = latestInvoice
//     ? latestInvoice.invoiceDetails.invoiceNumber + 1
//     : 1;

//   next();
// });

module.exports = mongoose.model("Invoice", invoiceSchema);