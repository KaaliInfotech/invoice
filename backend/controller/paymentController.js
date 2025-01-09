const invoice = require("../models/invoice");
const Payment = require("../models/payment");

module.exports.createPayment = async (req, res) => {
  try {
    const { invoiceNumber, date, amount } = req.body;

    const invoices = await invoice.findOne({
      "invoiceDetails.invoiceNumber": invoiceNumber,
    });

    if (!invoices) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    if (invoices.user_id.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        message: "You are not authorized to create a payment for this invoice",
      });
    }

    const payment = new Payment({
      invoiceNumber,
      date,
      amount,
      user_id: req.user.id,
    });

    const savedPayment = await payment.save();

    return res.status(201).json({
      message: "Payment created successfully",
      payment: savedPayment,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports.updatePayment = async (req, res) => {
  try {
    const updates = req.body;

    const payment = await Payment.findById(req.params.id);

    if (
      payment.user_id.toString() !== req.user.id.toString() &&
      payment.invoiceNumber !== req.body.invoiceNumber
    ) {
      return res.status(403).json({
        message: "You are not authorized to update this payment",
      });
    }

    const updatedPayment = await Payment.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedPayment) {
      return res.status(404).json({
        message: "Payment not found",
      });
    }

    return res.status(201).json({
      message: "Payment updated successfully",
      payment: updatedPayment,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports.deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({
        message: "Payment not found",
      });
    }
    if (payment.user_id.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        message: "You are not authorized to delete this payment",
      });
    }

    await Payment.findByIdAndDelete(req.params.id);

    return res.status(201).json({
      message: "Payment deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports.viewPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({
        message: "Payment not found",
      });
    }

    if (payment.user_id.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        message: "You are not authorized to view this payment",
      });
    }

    return res.status(201).json({
      message: "Payment details fetched successfully",
      payment,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports.getAllPayments = async (req, res) => {
  try {
    const userId = req.user.id;

    const payments = await Payment.find({ user_id: userId });

    if (!payments || payments.length === 0) {
      return res.status(404).json({
        message: "No payments found for this user",
      });
    }

    return res.status(201).json({
      message: "Payments fetched successfully",
      payments,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

// ############################################################## get all users payments without authentication ############################################################

module.exports.getAllUsersPayments = async (req, res) => {
  try {
    const payments = await Payment.find();

    return res.status(201).json({
      message: "Payments fetched successfully",
      payments,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
