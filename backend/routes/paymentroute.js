const express = require("express");
const { createPayment, updatePayment, deletePayment, viewPayment, getAllPayments, getAllUsersPayments } = require("../controller/paymentController");
const authenticate = require("../middleware/token");

const router = express.Router();

router.post("/createPayment", authenticate,createPayment);
router.put("/updatePayment/:id", authenticate,updatePayment);
router.delete("/deletePayment/:id", authenticate,deletePayment);
router.get("/viewsinglePayment/:id", authenticate,viewPayment);
router.get("/getallPayment", authenticate,getAllPayments);

// ########################################### without authentication payments ###########################################
router.get("/getallusersPayment",getAllUsersPayments);

module.exports = router;