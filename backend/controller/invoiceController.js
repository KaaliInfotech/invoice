const Invoice = require("../models/invoice");
const htmlPdf = require("html-pdf");
const ejs = require("ejs");
const path = require("path");
const fs = require("fs");
const puppeteer = require("puppeteer");
const { getConversionRate } = require("./currencyConverter");
const moment = require("moment");
const Company = require("../models/company");

module.exports.createInvoice = async (req, res) => {
  try {
    const {
      companyDetails,
      invoiceDetails,
      items,
      summary: summaryString,
      notes,
      terms,
      currency = "INR",
      paymentType,
      paymentStatus,
      company_id,
    } = req.body;

    // Parse the summary string into an object
    const summary =
      typeof summaryString === "string"
        ? JSON.parse(summaryString)
        : summaryString;

    // Extract values from the parsed summary
    const { discount, tax, shipping, amountPaid } = summary;

    // console.log(req.body)
    // console.log("Parsed Summary:", summary);
    // console.log("Tax received in backend:", tax);

    const errors = [];

    if (!companyDetails) errors.push("companyDetails is required.");
    if (!invoiceDetails) errors.push("invoiceDetails is required.");
    if (!items) errors.push("items are required.");
    // if (!signlogo) errors.push("Signature (signlogo) is required.");
    if (!company_id) errors.push("company_id is required.");
    if (!paymentType) errors.push("paymentType is required.");
    if (!paymentStatus) errors.push("paymentStatus is required.");

    if (errors.length > 0) {
      return res.status(400).json({
        message: "Validation errors occurred",
        errors: errors,
      });
    }
    // let logo;
    // if (req.file) {
    //   logo = req.file.filename;
    // }

    // Extract files for logo and signlogo
    const logo = req.files?.logo ? req.files.logo[0].filename : null;
    const signlogo = req.files?.signlogo
      ? req.files.signlogo[0].filename
      : null;

    const parsedItems = typeof items === "string" ? JSON.parse(items) : items;

    // const defaultCurrency = "INR";
    // const conversionRate = await getConversionRate(defaultCurrency, currency);

    const safeNumber = (value, conversionRate = 1) => {
      return isNaN(Number(value))
        ? 0
        : (Number(value) * conversionRate).toFixed(2);
    };

    console.log(req.body, "body");
    // console.log("Tax received in backend:", tax);

    const normalizedItems = parsedItems.map((item) => {
      // const convertedRate = (Number(item.rate) * conversionRate).toFixed(2);
      // const convertedAmount = (Number(item.quantity) * convertedRate).toFixed(2);
      return {
        ...item,
        rate: Number(item.rate),
        amount: Number(item.amount),
        quantity: Number(item.quantity),
      };
    });

    const subtotal2 = normalizedItems.reduce(
      (acc, item) => acc + Number(item.rate) * Number(item.quantity),
      0
    );

    const taxvalue = Number((Number(subtotal2) * Number(tax)) / 100);
    const discountvalue = Number((Number(subtotal2) * Number(discount)) / 100);
    const total2 = Number(
      Number(subtotal2) +
        Number(taxvalue) +
        Number(shipping) -
        Number(discountvalue)
    );

    const invoiceData = {
      logo,
      companyDetails:
        typeof companyDetails === "string"
          ? JSON.parse(companyDetails)
          : companyDetails,
      invoiceDetails:
        typeof invoiceDetails === "string"
          ? JSON.parse(invoiceDetails)
          : invoiceDetails,
      items: normalizedItems,
      summary: {
        subtotal: subtotal2.toFixed(2),
        discount: discount,
        tax: safeNumber(tax),
        shipping: shipping,
        amountPaid: safeNumber(amountPaid),
        total: safeNumber(total2),
        balanceDue: safeNumber(total2 - Number(amountPaid)),
      },
      signlogo,
      notes,
      terms,
      currency,
      paymentStatus,
      paymentType,
      company_id,
    };

    const user_id = req.user ? req.user.id : null;

    const newInvoice = new Invoice({
      ...invoiceData,
      user_id,
    });

    await newInvoice.save();

    return res.status(201).json({
      message: "Invoice created successfully",
      data: newInvoice,
    });
  } catch (error) {
    console.error("Error creating invoice:", error);
    return res.status(500).json({
      message: "Failed to create invoice",
      error: error.message,
    });
  }
};
module.exports.updateInvoice = async (req, res) => {
  try {
    const {
      companyDetails,
      invoiceDetails,
      items,
      notes,
      terms,
      paymentStatus,
      summary: summaryString,
      paymentType,
      company_id,
      currency = "INR",
    } = req.body;

    console.log(req.body, "reqBODY");

    // Parse the summary string into an object
    const summary =
      typeof summaryString === "string"
        ? JSON.parse(summaryString)
        : summaryString;

    // Extract values from the parsed summary
    const { discount, tax, shipping, amountPaid } = summary || {};

    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    // let updatedLogo = logo || invoice.logo;
    // if (req.file) {
    //   updatedLogo = req.file.filename;
    // }

    const logo = req.files?.logo ? req.files.logo[0].filename : invoice.logo;
    const signlogo = req.files?.signlogo
      ? req.files.signlogo[0].filename
      : invoice.signlogo;
    console.log(logo);
    // let upddatedsignLogo=signlogo || invoice.signlogo;

    const parsedItems =
      typeof items === "string" ? JSON.parse(items) : items || invoice.items;

    const defaultCurrency = "INR";
    const conversionRate = await getConversionRate(defaultCurrency, currency);

    const safeNumber = (value, conversionRate = 1) => {
      return isNaN(Number(value))
        ? 0
        : (Number(value) * conversionRate).toFixed(2);
    };

    const normalizedItems = parsedItems.map((item) => {
      const convertedRate = (Number(item.rate) * conversionRate).toFixed(2);
      const convertedAmount = (Number(item.quantity) * convertedRate).toFixed(
        2
      );
      return {
        ...item,
        rate: Number(item.rate),
        amount: Number(item.amount),
        quantity: Number(item.quantity),
      };
    });

    const subtotal2 = normalizedItems.reduce(
      (acc, item) => acc + Number(item.rate) * Number(item.quantity),
      0
    );

    const oldSummary = invoice.summary || {};

    const taxvalue = Number(
      (subtotal2 * (tax !== undefined ? tax : oldSummary.tax || 0)) / 100
    );
    const discountvalue = Number(
      (subtotal2 *
        (discount !== undefined ? discount : oldSummary.discount || 0)) /
        100
    );
    const shippingValue =
      shipping !== undefined ? shipping : oldSummary.shipping || 0;
    const total2 = Number(subtotal2 + taxvalue + shippingValue - discountvalue);

    const updatedInvoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      {
        logo,
        signlogo,
        companyDetails:
          typeof companyDetails === "string"
            ? JSON.parse(companyDetails)
            : companyDetails || invoice.companyDetails,
        invoiceDetails:
          typeof invoiceDetails === "string"
            ? JSON.parse(invoiceDetails)
            : invoiceDetails || invoice.invoiceDetails,
        items: normalizedItems,
        summary: {
          subtotal: subtotal2.toFixed(2),
          discount: discount !== undefined ? discount : oldSummary.discount,
          tax: safeNumber(tax !== undefined ? tax : oldSummary.tax),
          shipping: safeNumber(shippingValue),
          amountPaid: safeNumber(
            amountPaid !== undefined ? amountPaid : oldSummary.amountPaid
          ),
          total: total2.toFixed(2),
          balanceDue: (
            total2 -
            (amountPaid !== undefined ? amountPaid : oldSummary.amountPaid)
          ).toFixed(2),
        },
        notes: notes || invoice.notes,
        terms: terms || invoice.terms,
        currency: currency || invoice.currency,
        paymentStatus: paymentStatus || invoice.paymentStatus,
        paymentType: paymentType || invoice.paymentType,
        company_id: company_id || invoice.company_id,
      },
      { new: true } // Return the updated document
    );

    return res.status(200).json({
      message: "Invoice updated successfully!",
      data: updatedInvoice,
    });
  } catch (error) {
    console.error("Error updating invoice:", error);
    return res.status(500).json({
      message: "Failed to update invoice",
      error: error.message || error,
    });
  }
};
module.exports.listInvoices = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("Logged-in User ID:-", userId);

    const invoices = await Invoice.find({ user_id: userId });
    console.log("Fetched Invoices:", invoices);

    if (invoices && invoices.length > 0) {
      res.status(200).json({
        message: "Invoices fetched successfully!",
        data: invoices,
        length: invoices.length,
      });
    } else {
      return res.status(404).json({
        message: "No invoices found for this user.",
      });
    }
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return res.status(500).json({
      message: "Error fetching invoices.",
      error: error.message,
    });
  }
};

module.exports.viewInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({
        message: "Invoice not found",
      });
    }

    if (
      invoice.user_id &&
      (!req.user || invoice.user_id.toString() !== req.user.id)
    ) {
      return res.status(403).json({
        message: "Unauthorized access to this invoice",
      });
    }

    if (!invoice.user_id && req.user) {
      return res.status(403).json({
        message: "This invoice is not accessible for logged-in users",
      });
    }

    let companyData = null;
    if (invoice.company_id) {
      companyData = await Company.findById(invoice.company_id);
    }

    const responseData = {
      message: "Invoice fetched successfully",
      data: invoice,
    };

    if (companyData) {
      responseData.company = companyData;
    }
    return res
      .status(201)
      .json({ message: "Invoice fetched successfully", data: responseData });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch invoice",
      error: error.message,
    });
  }
};

module.exports.deleteInvoice = async (req, res) => {
  try {
    const deletedInvoice = await Invoice.findByIdAndDelete(req.params.id);

    if (!deletedInvoice) {
      return res.status(404).json({
        message: "Invoice not found",
      });
    }

    return res.status(201).json({
      message: "Invoice deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete invoice",
      error: error.message,
    });
  }
};

module.exports.downloadInvoicePdf = async (req, res) => {
  try {
    const invoice = await Invoice.findOne({ _id: req.params.id });

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    const company = await Company.findOne({ _id: invoice.company_id });

    if (!company) {
      return res.status(404).json({ message: "Company details not found" });
    }

    const logoPath = path.join(__dirname, "../public/logo", invoice.logo);

    if (!fs.existsSync(logoPath)) {
      console.error("Logo file does not exist:", logoPath);
      return res.status(404).json({ message: "Logo file not found" });
    }

    const signlogoPath = path.join(
      __dirname,
      "../public/logo",
      invoice.signlogo
    );
    if (!fs.existsSync(logoPath)) {
      return res.status(404).json({ message: "Signlogo file not found" });
    }

    const logoPath2 = path.join(__dirname, "../images/profile1.png");

    if (!fs.existsSync(logoPath2)) {
      return res.status(404).json({ message: "Static logo file not found" });
    }

    const logoBase64 = fs.readFileSync(logoPath, "base64");
    const logo1Base64 = fs.readFileSync(logoPath2, "base64");
    const signlogoBase64 = fs.readFileSync(signlogoPath, "base64");

    const ejsPath = path.join(__dirname, "../views/invoicepdf.ejs");
    const html = await ejs.renderFile(ejsPath, {
      company,
      invoice,
      logoBase64,
      logo1Base64,
      signlogoBase64,
    });

    const options = {
      format: "A4",
      orientation: "portrait",
      border: {
        top: "10mm",
        right: "10mm",
        bottom: "10mm",
        left: "10mm",
      },
    };

    htmlPdf.create(html, options).toBuffer((err, buffer) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Failed to generate PDF", error: err.message });
      }

      const pdfBase64 = buffer.toString("base64");

      return res.status(201).json({
        message: "PDF generated successfully",
        data: pdfBase64,
      });
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return res.status(500).json({
      message: "Failed to generate PDF",
      error: error.message,
    });
  }
};

module.exports.downloadInvoiceJpg = async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.query;
    const invoice = await Invoice.findOne({ _id: id });

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    const logoPath = path.join(__dirname, "../", invoice.logo);
    const signlogoPath = path.join(__dirname, "../", invoice.signlogo);
    const logoPath2 = path.join(__dirname, "../images/profile1.png");

    if (!fs.existsSync(logoPath)) {
      return res.status(404).json({ message: "Logo file not found" });
    }
    if (!fs.existsSync(signlogoPath)) {
      return res.status(404).json({ message: "Signlogo file not found" });
    }
    if (!fs.existsSync(logoPath2)) {
      return res.status(404).json({ message: "Static logo file not found" });
    }

    const logoBase64 = fs.readFileSync(logoPath, "base64");
    const signlogoBase64 = fs.readFileSync(signlogoPath, "base64");
    const logo1Base64 = fs.readFileSync(logoPath2, "base64");

    const ejsPath = path.join(__dirname, "../views/invoicejpg.ejs");
    const html = await ejs.renderFile(ejsPath, {
      invoice,
      logoBase64,
      logo1Base64,
      signlogoBase64,
    });

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const widthPx = 1000;
    const heightPx = 1000;

    await page.setViewport({ width: widthPx, height: heightPx });
    await page.setContent(html, { waitUntil: "networkidle0" });

    const imageType = type === "png" ? "png" : "jpeg";

    const fileName = `invoice-${id}.${imageType}`;
    const savePath = path.join(__dirname, "../public/images", fileName);

    await page.screenshot({
      path: savePath,
      type: imageType,
      quality: imageType === "jpeg" ? 80 : undefined,
      clip: {
        x: 0,
        y: 0,
        width: widthPx,
        height: heightPx,
      },
    });

    await browser.close();

    const imageUrl = `/images/${fileName}`;
    return res.status(201).json({
      message: "Invoice image generated successfully",
      imageUrl: imageUrl,
    });
  } catch (error) {
    console.error("Error generating image:", error);
    return res
      .status(500)
      .json({ message: "Error generating image", error: error.message });
  }
};
module.exports.searchInvoice = async (req, res) => {
  try {
    const { search } = req.query;
    let searchCriteria = {};

    if (search) {
      const date = new Date(search);

      if (!isNaN(date.getTime())) {
        const startDate = new Date(date);
        const endDate = new Date(date);
        endDate.setDate(endDate.getDate() + 1);

        searchCriteria["invoiceDetails.date"] = {
          $gte: startDate,
          $lt: endDate,
        };
      } else if (
        search.toLowerCase() === "paid" ||
        search.toLowerCase() === "pending"
      ) {
        searchCriteria["paymentStatus"] = {
          $regex: search,
          $options: "i",
        };
      } else {
        searchCriteria["companyDetails.customerName"] = {
          $regex: search,
          $options: "i",
        };
      }
    }

    const invoices = await Invoice.find(searchCriteria);

    if (invoices.length === 0) {
      return res.status(404).json({
        message: "No invoices found for the specified criteria",
      });
    }

    return res.status(201).json({
      message: "Invoices found",
      data: invoices,
    });
  } catch (error) {
    console.error("Error searching invoices:", error);
    return res.status(500).json({
      message: "Failed to search invoices",
      error: error.message,
    });
  }
};

module.exports.getTodayInvoices = async (req, res) => {
  try {
    const startOfDay = new Date(new Date().setHours(0, 0, 0, 0));
    const endOfDay = new Date(new Date().setHours(23, 59, 59, 999));

    const todayInvoices = await Invoice.find({
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    });

    return res.status(201).json({
      message: "Today's invoices fetched successfully!",
      data: todayInvoices,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch today's invoices",
      error: error.message,
    });
  }
};

// module.exports.getInvoicesByFilter = async (req, res) => {
//   try {
//     const { filter } = req.query;

//     let startDate, endDate;

//     const now = new Date();

//     switch (filter) {
//       case 'this_month':
//         startDate = new Date(now.getFullYear(), now.getMonth(), 1);
//         endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
//         break;
//       case 'last_30 days':
//         startDate = moment().subtract(30, 'days').startOf('day').toDate();
//         endDate = moment().endOf('day').toDate();
//         break;
//       case 'last_7 days':
//         startDate = moment().subtract(7, 'days').startOf('day').toDate();
//         endDate = moment().endOf('day').toDate();
//         break;
//       case 'last_month':
//         startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
//         endDate = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
//         break;
//       case 'yesterday':
//         startDate = moment().subtract(1, 'day').startOf('day').toDate();
//         endDate = moment().subtract(1, 'day').endOf('day').toDate();
//         break;
//       case 'today':
//         startDate = moment().startOf('day').toDate();
//         endDate = moment().endOf('day').toDate();
//         break;
//       case 'last_year':
//         startDate = new Date(now.getFullYear() - 1, 0, 1);
//         endDate = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59, 999);
//         break;
//       default:
//         return res.status(400).json({
//           message: "Invalid filter type. Valid filters are: this_month, last_30_days, last_7_days, last_month, yesterday, today, last_year.",
//         });
//     }

//     const invoices = await Invoice.find({
//       createdAt: { $gte: startDate, $lte: endDate },
//     });

//     return res.status(200).json({
//       message: `${filter.replace('_', ' ').toUpperCase()} invoices fetched successfully!`,
//       len: invoices.length,
//       data: invoices
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: "Failed to fetch invoices",
//       error: error.message,
//     });
//   }
// };

module.exports.getInvoicesByFilter = async (req, res) => {
  try {
    const {
      filter,
      startDate: customStartDate,
      endDate: customEndDate,
    } = req.query;

    let startDate, endDate;

    const now = new Date();

    switch (filter) {
      case "this_month":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(
          now.getFullYear(),
          now.getMonth() + 1,
          0,
          23,
          59,
          59,
          999
        );
        break;
      case "last_30 days":
        startDate = moment().subtract(30, "days").startOf("day").toDate();
        endDate = moment().endOf("day").toDate();
        break;
      case "last_7 days":
        startDate = moment().subtract(7, "days").startOf("day").toDate();
        endDate = moment().endOf("day").toDate();
        break;
      case "last_month":
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        endDate = new Date(
          now.getFullYear(),
          now.getMonth(),
          0,
          23,
          59,
          59,
          999
        );
        break;
      case "yesterday":
        startDate = moment().subtract(1, "day").startOf("day").toDate();
        endDate = moment().subtract(1, "day").endOf("day").toDate();
        break;
      case "today":
        startDate = moment().startOf("day").toDate();
        endDate = moment().endOf("day").toDate();
        break;
      case "last_year":
        startDate = new Date(now.getFullYear() - 1, 0, 1);
        endDate = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59, 999);
        break;
      case "custom":
        if (!customStartDate || !customEndDate) {
          return res.status(400).json({
            message:
              "For 'custom' filter, both startDate and endDate are required.",
          });
        }
        startDate = new Date(customStartDate);
        endDate = new Date(customEndDate);

        // Validate that startDate is before endDate
        if (startDate > endDate) {
          return res.status(400).json({
            message: "startDate must be earlier than endDate.",
          });
        }
        break;
      default:
        return res.status(400).json({
          message:
            "Invalid filter type. Valid filters are: this_month, last_30 days, last_7 days, last_month, yesterday, today, last_year, custom.",
        });
    }

    const query = filter
      ? {
          "invoiceDetails.date": {
            $gte: startDate,
            $lte: endDate,
          },
        }
      : {};

    const invoices = await Invoice.find(query);

    return res.status(200).json({
      message: `${filter
        .replace("_", " ")
        .toUpperCase()} invoices fetched successfully!`,
      len: invoices.length,
      data: invoices,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch invoices",
      error: error.message,
    });
  }
};

module.exports.changepaymentStatus = async (req, res) => {
  try {
    const invoices = await Invoice.findById(req.params.id);

    if (invoices.user_id.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        message: "Unauthorized access to this invoice",
      });
    }
    const invoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      { paymentStatus: "paid" },
      { new: true }
    );

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    return res.status(201).json({
      status: 201,
      message: "Payment status updated to paid",
      data: invoice,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error updating payment status", error: error.message });
  }
};
