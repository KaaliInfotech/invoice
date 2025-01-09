const express = require("express");
const {
  createInvoice,
  updateInvoice,
  listInvoices,
  viewInvoice,
  deleteInvoice,
  downloadInvoicePdf,
  downloadInvoiceJpg,
  searchInvoice,
  getTodayInvoices,
  getInvoicesByFilter,
  // downloadInvoiceJpg,
  changepaymentStatus
} = require("../controller/invoiceController");
const { upload } = require("../config/multer");
const authenticate = require("../middleware/token");
const router = express.Router();

// const uploadFields = upload.fields([
//   { name: 'logo', maxCount: 1 },
//   { name: 'signlogo', maxCount: 1 },
// ]);

// ########################################## WITHOUT ATHENTICATION #################################################
router.post("/invoiceCreate",upload, createInvoice);
router.get("/invoiceList", listInvoices);
router.get("/invoiceSingleView/:id", viewInvoice);
router.get("/invoiceDownload/:id", downloadInvoicePdf);
router.get("/invoiceDownloadjpg/:id", downloadInvoiceJpg);
// router.put("/invoiceUpdate/:id", upload.single("logo"), updateInvoice);
// router.delete("/invoiceDelete/:id", deleteInvoice);
// router.get("/invoiceSearch", searchInvoice);
// router.get("/invoiceTodayList", getTodayInvoices);

// ########################################## WITH AUTHENTICATION ###################################################
// router.post(
//   "/Createinvoice",
//   upload.single("logo"),
//   authenticate,
//   createInvoice
// );

router.post("/Createinvoice", authenticate,upload, createInvoice);
// router.post("/Createinvoice",authenticate, uploadFields,  createInvoice);
router.put(
  "/Updateinvoice/:id",
  authenticate,
  upload,
  updateInvoice
);
router.get("/Listinvoice", authenticate, listInvoices);
router.get("/ViewSingleinvoice/:id", authenticate, viewInvoice);
router.delete("/Deleteinvoice/:id", authenticate, deleteInvoice);
router.get("/Downloadinvoice/:id", authenticate, downloadInvoicePdf);
// router.get("/DownloadInvoiceJpg/:id", downloadInvoiceJpg);
router.get("/Searchinvoice", authenticate, searchInvoice);
router.get("/TodayListinvoice", getTodayInvoices);
router.get("/filterlistinvoice", authenticate,getInvoicesByFilter);
router.patch("/changePaymentStatus/:id", authenticate, changepaymentStatus);

module.exports = router;
