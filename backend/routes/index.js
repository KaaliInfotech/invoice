const express = require("express");
const authRoute = require("./authroute");
const invoiceRoute = require("./invoiceroute");
const userRoute = require("./userroute");
const paymentRoute = require("./paymentroute");
const companyRoute = require("./companyroute");

const router = express.Router();
router.use("/auth", authRoute);
router.use("/invoice", invoiceRoute);
router.use("/user", userRoute);
router.use("/payment", paymentRoute);
router.use("/company", companyRoute);

module.exports = router;
