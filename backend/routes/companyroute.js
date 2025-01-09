const express = require("express");
const { createCompany, updateCompany, viewsingleCompany, listCompany, deleteCompany } = require("../controller/companyController");

const router = express.Router();

router.post("/companyCreate", createCompany);
router.put("/companyUpdate/:id", updateCompany);
router.get("/companyViewSingle/:id", viewsingleCompany);
router.delete("/companyDelete/:id", deleteCompany);
router.get("/companyList", listCompany);

module.exports = router;