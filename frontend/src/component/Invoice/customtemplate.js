

// import React, { useState, useEffect, useRef } from "react";

// import LogoIcon from "../../images/Frame.svg";
// import downloadIcon from "../../images/receipt_long.svg";
// import SaveIcon from "../../images/drafts.svg";
// import EditIcon from "../../images/edit.svg";
// import DeleteIcon from "../../images/delete_forever.svg";
// import CancelIcon from "../../images/cancel.svg";
// import CheckIcon from "../../images/check_circle.svg";
// import { createCompany, downloadpdfInvoice } from "../../api";
// import getUserIdFromToken from "../tokendecode";
// import { useParams } from "react-router-dom";
// import SignatureCanvas from "react-signature-canvas";

// const Custom = () => {
//   const signaturePadRef = useRef(null);
//   const [isSignatureSaved, setIsSignatureSaved] = useState(false);
//   const [savedSignature, setSavedSignature] = useState(null);
//   const [signLogo, setSignLogo] = useState(null);

//   const [invoiceNumber, setInvoiceNumber] = useState(1);
//   const userId = getUserIdFromToken();

//   const validateItems = () => {
//     let errors = {};
//     let hasError = false;

//     items.forEach((item, index) => {
//       if (!item.name) {
//         errors[`name-${index}`] = "Item name is required.";
//         hasError = true;
//       }
//       if (!item.quantity) {
//         errors[`quantity-${index}`] = "Quantity is required.";
//         hasError = true;
//       }
//       if (!item.rate) {
//         errors[`rate-${index}`] = "Rate is required.";
//         hasError = true;
//       }
//     });

//     setFormErrors(errors);
//     return !hasError;
//   };

//   const baseRates = {
//     AED: { rate: 0.3673, symbol: "د.إ" },
//     AFN: { rate: 0.0121, symbol: "؋" },
//     USD: { rate: 0.012, symbol: "$" },
//     EUR: { rate: 0.011, symbol: "€" },
//     GBP: { rate: 1.3889, symbol: "£" },
//     ARS: { rate: 0.1135, symbol: "$" },
//     AUD: { rate: 0.771, symbol: "A$" },
//     CAD: { rate: 0.798, symbol: "C$" },
//     CNY: { rate: 0.153, symbol: "¥" },
//     JPY: { rate: 0.171, symbol: "¥" },
//     CHF: { rate: 0.735, symbol: "CHF" },
//     DKK: { rate: 0.09, symbol: "kr" },
//     KRW: { rate: 0.015, symbol: "₩" },
//     MXN: { rate: 0.24, symbol: "$" },
//     RUB: { rate: 0.919, symbol: "₽" },
//     SGD: { rate: 0.016, symbol: "S$" },
//     TRY: { rate: 0.107, symbol: "₺" },
//     ZAR: { rate: 0.235, symbol: "R" },
//     KWD: { rate: 0.0036, symbol: "د.ك" },
//     LKR: { rate: 0.144, symbol: "Rs" },
//     NGN: { rate: 5.62, symbol: "₦" },
//     PKR: { rate: 1.25, symbol: "₨" },
//     THB: { rate: 0.032, symbol: "฿" },
//     VND: { rate: 0.024, symbol: "₫" },
//     INR: { rate: 1.0, symbol: "₹" },
//     BRL: { rate: 0.076, symbol: "R$" },
//     CUP: { rate: 0.024, symbol: "₱" },
//     SAR: { rate: 0.045, symbol: "﷼" },
//     QAR: { rate: 0.045, symbol: "﷼" },
//     NPR: { rate: 0.118, symbol: "रू" },
//     RWF: { rate: 2.16, symbol: "FRw" },
//     KES: { rate: 1.11, symbol: "KSh" },
//     UGX: { rate: 2.29, symbol: "USh" },
//     BHD: { rate: 0.0004, symbol: "ب.د" },
//     SYP: { rate: 0.036, symbol: "£" },
//     MYR: { rate: 0.241, symbol: "RM" },
//     MUR: { rate: 0.605, symbol: "₨" },
//     TND: { rate: 0.35, symbol: "د.ت" },
//     OMR: { rate: 0.0039, symbol: "﷼" },
//     GHS: { rate: 0.061, symbol: "₵" },
//     BBD: { rate: 0.02, symbol: "Bds$" },
//     GEL: { rate: 0.302, symbol: "₾" },
//     CVE: { rate: 0.048, symbol: "$" },
//     BZD: { rate: 0.02, symbol: "BZ$" },
//     HUF: { rate: 0.3, symbol: "Ft" },
//     HRK: { rate: 0.164, symbol: "kn" },
//     DOP: { rate: 0.017, symbol: "RD$" },
//     ISK: { rate: 0.0078, symbol: "kr" },
//     JMD: { rate: 1.65, symbol: "J$" },
//     LYD: { rate: 0.007, symbol: "ل.د" },
//     ZWL: { rate: 0.051, symbol: "Z$" },
//     SLL: { rate: 104.5, symbol: "Le" },
//     TJS: { rate: 0.0091, symbol: "SM" },
//     WST: { rate: 0.067, symbol: "T" },
//     FJD: { rate: 0.021, symbol: "FJ$" },
//     PGK: { rate: 0.07, symbol: "K" },
//     FOK: { rate: 0.067, symbol: "kr" },
//   };

//   const [selectedCurrency, setSelectedCurrency] = useState({
//     code: "INR",
//     symbol: baseRates["INR"]?.symbol,
//   });
//   const handleCurrencyChange = (e) => {
//     const selectedCode = e.target.value;
//     const selectedSymbol = baseRates[selectedCode]?.symbol;
//     const selectedRate = baseRates[selectedCode]?.rate || 1;

//     setSelectedCurrency({ code: selectedCode, symbol: selectedSymbol });
//     setShipping((prevShipping) =>
//       parseFloat(
//         (
//           (prevShipping / baseRates[selectedCurrency.code]?.rate || 1) *
//           selectedRate
//         ).toFixed(2)
//       )
//     );

//     // Convert and format the amountPaid value
//     setAmountPaid((prevAmountPaid) =>
//       parseFloat(
//         (
//           (prevAmountPaid / baseRates[selectedCurrency.code]?.rate || 1) *
//           selectedRate
//         ).toFixed(2)
//       )
//     );

//     // Update all items with the new rate and format them
//     setItems((prevItems) =>
//       prevItems.map((item) => ({
//         ...item,
//         rate: parseFloat(
//           (
//             (item.rate / baseRates[selectedCurrency.code]?.rate || 1) *
//             selectedRate
//           ).toFixed(2)
//         ),
//       }))
//     );
//   };

//   const handleRate = (index, e) => {
//     const { name, value } = e.target;
//     setItems((prevItems) =>
//       prevItems.map((item, i) =>
//         i === index ? { ...item, [name]: value } : item
//       )
//     );
//   };

//   const saveSignature = () => {
//     const signatureDataUrl = signaturePadRef.current.toDataURL("image/png");
//     const byteString = atob(signatureDataUrl.split(",")[1]); // Decode the base64 string
//     const arrayBuffer = new ArrayBuffer(byteString.length);
//     const uintArray = new Uint8Array(arrayBuffer);

//     for (let i = 0; i < byteString.length; i++) {
//       uintArray[i] = byteString.charCodeAt(i);
//     }

//     // Create a Blob from the byte array
//     const signatureBlob = new Blob([uintArray], { type: "image/png" });

//     // Create a file from the Blob
//     const signatureFile = new File([signatureBlob], "signature.png", {
//       type: "image/png",
//     });

//     // Save the signature file and mark it as saved
//     setSavedSignature(signatureFile);
//     setSignLogo(signatureFile);
//     setIsSignatureSaved(true);
//     console.log(signatureFile); // This is the File object, which can be sent to the backend
//   };

//   const clearSignature = () => {
//     signaturePadRef.current.clear();
//     setIsSignatureSaved(false);
//   };

//   const handleImageUpload = (event) => {
//     const file = event.target.files[0];
//     if (file && file.type.startsWith("image/")) {
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         const img = new Image();
//         img.onload = () => {
//           const canvas = signaturePadRef.current.getCanvas();
//           const ctx = canvas.getContext("2d");
//           ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas before drawing
//           ctx.drawImage(img, 0, 0, canvas.width, canvas.height); // Draw the uploaded image

//           // Convert the uploaded image to a PNG Blob and File object
//           const signatureDataUrl =
//             signaturePadRef.current.toDataURL("image/png");
//           const byteString = atob(signatureDataUrl.split(",")[1]); // Decode the base64 string
//           const arrayBuffer = new ArrayBuffer(byteString.length);
//           const uintArray = new Uint8Array(arrayBuffer);

//           // Convert byte string to byte array
//           for (let i = 0; i < byteString.length; i++) {
//             uintArray[i] = byteString.charCodeAt(i);
//           }

//           // Create a Blob from the byte array
//           const signatureBlob = new Blob([uintArray], { type: "image/png" });

//           // Create a file from the Blob
//           const signatureFile = new File([signatureBlob], "signature.png", {
//             type: "image/png",
//           });

//           // Save the signature file and mark it as saved
//           setSavedSignature(signatureFile);
//           setIsSignatureSaved(true);
//           console.log(signatureFile); // This is the File object, which can be sent to the backend
//         };
//         img.src = e.target.result;
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const [logo, setLogo] = useState(null);
//   const [blogo, setbLogo] = useState(null);
//   const initialFormData = {
//     name: "",
//     mobileNumber: "",
//     email: "",
//     address: "",
//   };
//   const [formData, setFormData] = useState(initialFormData);
//   const [companyData, setcompanyData] = useState({
//     date: "",
//     dueDate: "",
//     phoneNumber: "",
//   });
//   const [customerdetails, setCustomerdetails] = useState({
//     customerName: "",
//     shipTo: "",
//   });
//   const [isEditable, setIsEditable] = useState(true);
//   const [items, setItems] = useState([{ name: "", quantity: 1, rate: 0 }]);
//   const [subtotal, setSubtotal] = useState(0);
//   const [taxRate, setTaxRate] = useState(0);
//   const [amountPaid, setAmountPaid] = useState(0);
//   const [discount, setDiscount] = useState(0);
//   const [shipping, setShipping] = useState(0);
//   const [showDiscount, setShowDiscount] = useState(false);
//   const [showShipping, setShowShipping] = useState(false);
//   const [notes, setNotes] = useState("");
//   const [terms, setTerms] = useState("");
//   const [companyId, setCompanyId] = useState(null);
//   const [invoiceId, setInvoiceId] = useState(null);
//   const { id } = useParams();

//   const [isEditable1, setIsEditable1] = useState(true);
//   const [isEditable2, setIsEditable2] = useState(true);
//   const [isEditable3, setIsEditable3] = useState(true);

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const openModal = () => setIsModalOpen(true);
//   const closeModal = () => setIsModalOpen(false);

//   const clearData = () => {
//     setLogo(null);
//     setbLogo(null);
//     setIsSignatureSaved(false);
//     setFormData(initialFormData);
//     setcompanyData({
//       date: "",
//       dueDate: "",
//       phoneNumber: "",
//     });
//     setCustomerdetails({
//       customerName: "",
//       shipTo: "",
//     });
//     setIsEditable(true);
//     setItems([{ name: "", quantity: 1, rate: 0 }]);
//     setSubtotal(0);
//     setTaxRate(0);
//     setAmountPaid(0);
//     setDiscount(0);
//     setShipping(0);
//     setShowDiscount(false);
//     setShowShipping(false);
//     setNotes("");
//     setTerms("");
//     setCompanyId(null);
//     setInvoiceId(null);
//   };
//   const handleChange55 = (event) => {
//     const value = event.target.value;
//     setTaxRate(value ? Number(value) : 0); // Ensure taxRate is a valid number
//   };

//   const handleChange56 = (event) => {
//     const value = event.target.value;
//     setDiscount(value ? Number(value) : 0); // Ensure taxRate is a valid number
//   };

//   const handleChange57 = (e) => {
//     const value = e.target.value;
//     if (!isNaN(value) && value.trim() !== "") {
//       setShipping(parseFloat(value));
//     } else {
//       setShipping(0); // Set to 0 for invalid or empty input
//     }
//   };

//   const handleAmountPaidChange = (e) => {
//     const value = parseFloat(e.target.value);
//     if (!isNaN(value)) {
//       setAmountPaid(value);
//     }
//   };

//   const handleBlur = () => {
//     if (isNaN(taxRate)) {
//       setTaxRate(0); // Reset to 0 if the input is invalid
//     }
//     setIsEditable1(false); // Lock the value after the user finishes editing
//   };

//   const handleBlur2 = () => {
//     if (isNaN(discount)) {
//       setDiscount(0); // Reset to 0 if the input is invalid
//     }
//     setIsEditable2(false); // Lock the value after the user finishes editing
//   };

//   const handleBlur3 = () => {
//     if (isNaN(shipping)) {
//       setShipping(0); // Reset to 0 if the input is invalid
//     }
//     setIsEditable3(false); // Lock the value after the user finishes editing
//   };

//   const handleChange1 = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleChange2 = (e) => {
//     const { name, value } = e.target;
//     if (name === "phoneNumber") {
//       if (/^\d*$/.test(value)) {
//         // Allow only numbers
//         setcompanyData((prevData) => ({
//           ...prevData,
//           [name]: value,
//         }));
//       }
//     } else {
//       setcompanyData((prevData) => ({
//         ...prevData,
//         [name]: value,
//       }));
//     }
//   };

//   const handleLogoChange = (e) => {
//     const file = e.target.files[0];
//     setbLogo(file);
//     console.log(blogo);
//     if (file) {
//       const imageUrl = URL.createObjectURL(file);
//       setLogo(imageUrl);
//     }
//   };

//   const [formErrors, setFormErrors] = useState({});
//   const [isSubmitted, setIsSubmitted] = useState(false);

//   const handleSave = async (e) => {
//     e.preventDefault();
//     setIsSubmitted(true);
//     const errors = {};

//     if (!formData.name) errors.name = "This field is required.";
//     if (!formData.mobileNumber) errors.mobileNumber = "This field is required.";
//     if (!formData.email) errors.email = "This field is required.";
//     if (!formData.address) errors.address = "This field is required.";

//     setFormErrors(errors);

//     try {
//       const response = await fetch(
//         "http://localhost:5001/api/company/companyCreate",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(formData),
//         }
//       );

//       if (!response.ok) {
//         const data = await response.json();
//         if (data.field && data.message) {
//           setFormErrors((prevErrors) => ({
//             ...prevErrors,
//             [data.field]: data.message,
//           }));
//         }
//       } else {
//         const data = await response.json();
//         setCompanyId(data.Company._id);
//         setIsEditable(false);
//         console.log("Company saved successfully!");
//       }
//     } catch (err) {
//       console.error("Error saving the form:", err);
//     }
//   };

//   const handleCancel = () => {
//     setFormData({
//       name: "",
//       mobileNumber: "",
//       email: "",
//       address: "",
//     });
//     setIsEditable(true);
//   };
//   const handleChange = (index, event) => {
//     const values = [...items];
//     const updatedItem = { ...values[index] };

//     updatedItem[event.target.name] = event.target.value;

//     if (event.target.name === "quantity" || event.target.name === "rate") {
//       updatedItem.amount = updatedItem.quantity * updatedItem.rate;
//     }

//     values[index] = updatedItem;
//     setItems(values);
//   };

//   const removeItem = (index) => {
//     const values = [...items];
//     values.splice(index, 1);
//     setItems(values);
//   };

//   const addItem = () => {
//     setItems([...items, { name: "", quantity: 1, rate: 0 }]);
//   };

//   const calculateSubtotal = () => {
//     const newSubtotal = items.reduce(
//       (sum, item) => sum + Number(item.quantity * item.rate),
//       0
//     );
//     setSubtotal(newSubtotal);
//   };

//   const taxvalue = Number((Number(subtotal) * Number(taxRate)) / 100);
//   const discountvalue = Number((Number(subtotal) * Number(discount)) / 100);
//   const total2 = Number(
//     Number(subtotal) +
//       Number(taxvalue) +
//       Number(shipping) -
//       Number(discountvalue)
//   );
//   const balanceDue = Number(total2 - Number(amountPaid));

//   useEffect(() => {
//     calculateSubtotal();
//   }, [items]);

//   const handleCreateInvoice = async () => {
//     setFormErrors({
//       date: "",
//       dueDate: "",
//       phoneNumber: "",
//       customerName: "",
//       shipTo: "",
//     });

//     let hasError = false;
//     const errors = {};

//     const requiredFields = {
//       date: "Date",
//       dueDate: "Due Date",
//       phoneNumber: "Phone Number",
//       customerName: "Customer Name",
//       shipTo: "Ship To",
//     };

//     if (!logo) {
//       errors.logo = "Logo is required.";
//       hasError = true;
//     }

//     if (!savedSignature) {
//       errors.signlogo = "Signature is required.";
//       hasError = true;
//     }

//     items.forEach((item, index) => {
//       if (!item.name) {
//         errors[`name-${index}`] = "Item name is required.";
//         hasError = true;
//       }
//       if (!item.quantity) {
//         errors[`quantity-${index}`] = "Quantity is required.";
//         hasError = true;
//       }
//       if (!item.rate) {
//         errors[`rate-${index}`] = "Rate is required.";
//         hasError = true;
//       }
//     });

//     Object.keys(requiredFields).forEach((field) => {
//       if (!companyData[field] && field in companyData) {
//         errors[field] = `${requiredFields[field]} is required.`;
//         hasError = true;
//       }
//       if (!customerdetails[field] && field in customerdetails) {
//         errors[field] = `${requiredFields[field]} is required.`;
//         hasError = true;
//       }
//     });

//     if (hasError) {
//       setFormErrors(errors);
//       return;
//     }
//     if (validateItems()) {
//       console.log("Items are valid, proceed with saving.");
//     } else {
//       console.log("Please fill in all required fields.");
//     }

//     const userId = getUserIdFromToken();
//     console.log(userId, "IDUSER");

//     const formData = new FormData();

//     const parsedItems = items.map((item) => ({
//       ...item,
//       quantity: Number(item.quantity) || 0,
//       rate: Number(item.rate) || 0,
//       amount: (Number(item.quantity) || 0) * (Number(item.rate) || 0),
//     }));
//     formData.append("logo", blogo);
//     formData.append(
//       "companyDetails",
//       JSON.stringify({
//         customerName: customerdetails.customerName,
//         shipTo: customerdetails.shipTo,
//       })
//     );

//     formData.append(
//       "invoiceDetails",
//       JSON.stringify({
//         date: companyData.date,
//         dueDate: companyData.dueDate,
//         phoneNumber: companyData.phoneNumber,
//         invoiceNumber: invoiceNumber,
//       })
//     );

//     localStorage.setItem(`invoiceNumber_${userId?.id}`, invoiceNumber);
//     formData.append("items", JSON.stringify(parsedItems));
//     formData.append(
//       "summary",
//       JSON.stringify({
//         subtotal: subtotal,
//         tax: taxRate,
//         total: Number(total2),
//         amountPaid: Number(amountPaid),
//         discount: Number(discount),
//         shipping: shipping,
//         balanceDue,
//       })
//     );

//     formData.append("signlogo", savedSignature);

//     formData.append("notes", notes);
//     formData.append("terms", terms);
//     formData.append("currency", selectedCurrency.code);
//     formData.append("company_id", companyId);
//     if (userId) {
//       formData.append("user_id", userId.id);
//     }
//     formData.append("paymentType", "other");
//     formData.append("paymentStatus", "pending");

//     console.log(formData);
//     const token = localStorage.getItem("token");
//     if (token) {
//       const response = await fetch(
//         "http://localhost:5001/api/invoice/Createinvoice",
//         {
//           method: "POST",
//           headers: {
//             Authorization: token,
//           },
//           body: formData,
//         }
//       );
//       const responseData = await response.json();
//       if (responseData.data) {
//         setInvoiceId(responseData.data._id);
//       }
//     } else {
//       const response = await fetch(
//         "http://localhost:5001/api/invoice/invoiceCreate",
//         {
//           method: "POST",
//           body: formData,
//         }
//       );
//       const responseData = await response.json();
//       if (responseData.data) {
//         setInvoiceId(responseData.data._id);
//       }
//     }
//   };

//   const formatToYYYYMMDD = (isoDate) => {
//     const date = new Date(isoDate);
//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, "0");
//     const day = String(date.getDate()).padStart(2, "0");
//     return `${year}-${month}-${day}`;
//   };

//   const fetchInvoiceData = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch(
//         `http://localhost:5001/api/invoice/ViewSingleinvoice/${id}`,
//         {
//           method: "GET",
//           headers: {
//             Authorization: token,
//           },
//         }
//       );
//       const data = await response.json();
//       const newdata = data.data;
//       console.log(newdata.data.notes, "DATA");

//       if (newdata) {
//         setFormData({
//           name: newdata.company.name,
//           mobileNumber: newdata.company.mobileNumber,
//           email: newdata.company.email,
//           address: newdata.company.address,
//         });
//         const logoUrl = `http://localhost:5001/api/${newdata.data.logo}`;
//         setLogo(logoUrl);

//         const signLogoUrl = `http://localhost:5001/api/${newdata.data.signlogo}`;
//         setSignLogo(signLogoUrl);

//         setCompanyId(newdata.company._id);
//         setIsEditable(false);
//         setcompanyData({
//           date: formatToYYYYMMDD(newdata.data.invoiceDetails.date),
//           dueDate: formatToYYYYMMDD(newdata.data.invoiceDetails.dueDate),
//           phoneNumber: newdata.data.invoiceDetails.phoneNumber,
//         });
//         const fetchedCurrencyCode = newdata.data.currency;

//         setSelectedCurrency({
//           code: fetchedCurrencyCode,
//           symbol: baseRates[fetchedCurrencyCode]?.symbol,
//         });
//         setInvoiceNumber(newdata.data.invoiceDetails.invoiceNumber);
//         setCustomerdetails({
//           customerName: newdata.data.companyDetails.customerName,
//           shipTo: newdata.data.companyDetails.shipTo,
//         });
//         setSavedSignature(signLogoUrl);
//         setItems(newdata.data.items);
//         setTaxRate(newdata.data.summary.tax);
//         setDiscount(newdata.data.summary.discount);
//         setShipping(newdata.data.summary.shipping);
//         setAmountPaid(newdata.data.summary.amountPaid);
//         setNotes(newdata.data.notes);
//         setTerms(newdata.data.terms);
//       }
//     } catch (error) {
//       console.error("Error fetching invoice data:", error);
//     }
//   };

//   const handleUpdateInvoice = async () => {
//     const userId = getUserIdFromToken();

//     const formData = new FormData();

//     const parsedItems = items.map((item) => ({
//       ...item,
//       quantity: Number(item.quantity) || 0,
//       rate: Number(item.rate) || 0,
//       amount: (Number(item.quantity) || 0) * (Number(item.rate) || 0),
//     }));
//     console.log(parsedItems, "PITEM");

//     formData.append("logo", blogo);
//     formData.append(
//       "companyDetails",
//       JSON.stringify({
//         customerName: customerdetails.customerName,
//         shipTo: customerdetails.shipTo,
//       })
//     );

//     formData.append(
//       "invoiceDetails",
//       JSON.stringify({
//         date: companyData.date,
//         dueDate: companyData.dueDate,
//         phoneNumber: companyData.phoneNumber,
//         invoiceNumber: invoiceNumber,
//       })
//     );

//     formData.append("items", JSON.stringify(parsedItems));

//     formData.append(
//       "summary",
//       JSON.stringify({
//         subtotal: subtotal,
//         tax: taxRate,
//         total: Number(total2),
//         amountPaid: Number(amountPaid),
//         discount: discount,
//         shipping: shipping,
//         balanceDue: balanceDue,
//       })
//     );

//     if (savedSignature) {
//       formData.append("signlogo", savedSignature);
//     }
//     formData.append("notes", notes);
//     formData.append("terms", terms);
//     formData.append("currency", selectedCurrency.code);
//     formData.append("company_id", companyId);
//     if (userId) {
//       formData.append("user_id", userId.id);
//     }
//     formData.append("paymentType", "other");

//     const token = localStorage.getItem("token");
//     console.log("Form Data Before Sending:", {
//       logo: blogo,
//       companyDetails: customerdetails,
//       invoiceDetails: companyData,
//       items: parsedItems,
//       summary: {
//         subtotal,
//         taxRate,
//         total: subtotal + (subtotal * taxRate) / 100,
//         amountPaid,
//         balanceDue,
//       },
//       notes,
//       terms,
//     });

//     try {
//       const response = await fetch(
//         `http://localhost:5001/api/invoice/Updateinvoice/${id}`,
//         {
//           method: "PUT",
//           headers: {
//             Authorization: token,
//           },
//           body: formData,
//         }
//       );

//       const responseData = await response.json();
//       console.log(responseData, "responseData");
//       if (responseData.data) {
//         setInvoiceId(responseData.data._id);
//       }
//     } catch (error) {
//       console.error("Error creating/updating invoice:", error);
//     }
//   };

//   useEffect(() => {
//     const fetchStoredInvoiceNumber = async () => {
//       const storedInvoiceNumber = localStorage.getItem("invoicelength");
//       if (storedInvoiceNumber) {
//         setInvoiceNumber(parseInt(storedInvoiceNumber, 10) + 1);
//       } else {
//         setInvoiceNumber(1);
//       }

//       if (id) {
//         await fetchInvoiceData();
//       }
//     };

//     fetchStoredInvoiceNumber();
//   }, [userId?.id, id]);

//   const downloadInvoicePdf = async () => {
//     try {
//       const response = await downloadpdfInvoice(invoiceId);

//       if (!response || !response.data) {
//         throw new Error("Invalid API response: Missing base64 data");
//       }
//       let base64PDF = response.data;
//       base64PDF = base64PDF.replace(/\s/g, "");

//       base64PDF = base64PDF.replace(/^data:application\/pdf;base64,/, "");
//       const binaryString = atob(base64PDF);
//       const length = binaryString.length;
//       const bytes = new Uint8Array(length);

//       for (let i = 0; i < length; i++) {
//         bytes[i] = binaryString.charCodeAt(i);
//       }

//       const blob = new Blob([bytes], { type: "application/pdf" });

//       const link = document.createElement("a");
//       const url = URL.createObjectURL(blob);

//       link.href = url;
//       link.download = `invoice/id=${invoiceId}.pdf`;
//       link.click();

//       URL.revokeObjectURL(url);
//     } catch (error) {
//       console.error("Error downloading PDF:", error);
//     }
//   };

//   return (
//     <>
//       <div className="min-h-screen flex flex-col items-center py-10">
//         <div className="w-full max-w-6xl shadow-2xl rounded-lg p-8 flex flex-col md:flex-row">
//           <div className="w-full md:w-3/4 pr-0 md:pr-6">
//             <h2 className="text-lg mb-4 mr-4 font-medium text-txt-blue">
//               Your Details
//             </h2>
//             <div className="flex flex-col md:flex-row md:justify-between bg-[#babfee] mb-8 p-4">
//               <div className="w-full md:w-auto flex flex-col items-center md:items-start text-xs">
//                 <div className="text-black text-center md:text-left w-full md:w-auto mb-2">
//                   Name
//                 </div>
//                 {isEditable ? (
//                   <>
//                     <input
//                       type="text"
//                       name="name"
//                       onChange={handleChange1}
//                       value={formData.name}
//                       placeholder="Your Company Name"
//                       className={`block w-3/4 md:w-full text-txt-blue text-center md:text-left rounded p-2 mb-1 border placeholder-gray-900 ${
//                         isSubmitted && formErrors.name ? "border-red-500" : ""
//                       }`}
//                     />
//                     {isSubmitted && formErrors.name && (
//                       <p className="text-red-500 text-sm mb-1">
//                         {formErrors.name}
//                       </p>
//                     )}
//                   </>
//                 ) : (
//                   <div className="text-black text-center md:text-left w-3/4 md:w-full mb-2">
//                     {formData.name || "Your Company Name"}
//                   </div>
//                 )}

//                 <div className="text-black text-center md:text-left w-full md:w-auto mb-2">
//                   Phone Number
//                 </div>
//                 {isEditable ? (
//                   <>
//                     <input
//                       type="text"
//                       name="mobileNumber"
//                       onChange={handleChange1}
//                       value={formData.mobileNumber}
//                       placeholder="00000 00000"
//                       className={`block w-3/4 md:w-full text-txt-blue text-center md:text-left rounded p-2 mb-1 border placeholder-gray-900 ${
//                         isSubmitted && formErrors.mobileNumber
//                           ? "border-red-500"
//                           : ""
//                       }`}
//                     />
//                     {isSubmitted && formErrors.mobileNumber && (
//                       <p className="text-red-500 text-sm mb-1">
//                         {formErrors.mobileNumber}
//                       </p>
//                     )}
//                   </>
//                 ) : (
//                   <div className="text-black text-center md:text-left w-3/4 md:w-full mb-3">
//                     {formData.mobileNumber || "00000 00000"}
//                   </div>
//                 )}

//                 <div className="text-black text-center md:text-left w-full md:w-auto mb-2">
//                   Email
//                 </div>
//                 {isEditable ? (
//                   <>
//                     <input
//                       type="email"
//                       name="email"
//                       value={formData.email}
//                       onChange={handleChange1}
//                       placeholder="Email id Here"
//                       className={`block w-3/4 md:w-full  text-txt-blue text-center md:text-left rounded p-2 mb-1 border placeholder-gray-900 ${
//                         isSubmitted && formErrors.email ? "border-red-500" : ""
//                       }`}
//                     />
//                     {isSubmitted && formErrors.email && (
//                       <p className="text-red-500 text-sm mb-1">
//                         {formErrors.email}
//                       </p>
//                     )}
//                   </>
//                 ) : (
//                   <div className="text-black text-center md:text-left w-3/4 md:w-full mb-3">
//                     {formData.email || "Email id Here"}
//                   </div>
//                 )}

//                 <div className="text-black text-center md:text-left w-full md:w-auto mb-2">
//                   Address
//                 </div>
//                 {isEditable ? (
//                   <>
//                     <textarea
//                       rows="1"
//                       name="address"
//                       onChange={handleChange1}
//                       value={formData.address}
//                       placeholder="Address Here"
//                       className={`block w-3/4 md:w-full text-txt-blue text-center md:text-left rounded p-2 mb-2 border placeholder-gray-900 ${
//                         isSubmitted && formErrors.address
//                           ? "border-red-500"
//                           : ""
//                       }`}
//                     />
//                     {isSubmitted && formErrors.address && (
//                       <p className="text-red-500 text-sm mb-1">
//                         {formErrors.address}
//                       </p>
//                     )}
//                   </>
//                 ) : (
//                   <div className="text-black text-center md:text-left w-3/4 md:w-full  mb-2">
//                     {formData.address || "Address Here"}
//                   </div>
//                 )}

//                 {isEditable && (
//                   <div className="flex justify-center md:justify-end mt-4 space-x-4">
//                     <button
//                       className="text-txt-blue rounded-lg border flex items-center px-4 py-2"
//                       onClick={handleCancel}
//                     >
//                       <img src={CancelIcon} alt="Cancel" className="mr-2" />{" "}
//                       Cancel
//                     </button>
//                     <button
//                       className="bg-[#5578cf] text-white rounded-lg flex items-center px-4 py-2 hover:bg-[#5d80d8]"
//                       onClick={handleSave}
//                     >
//                       <img src={CheckIcon} alt="Save" className="mr-2" /> Save
//                     </button>
//                   </div>
//                 )}
//               </div>
//               <div className="flex-shrink-0 w-32 h-32 border border-dashed border-black flex items-center justify-center text-black rounded-2xl mb-4 md:mb-0 md:ml-4 relative">
//                 {logo ? (
//                   <img
//                     src={logo}
//                     alt="Logo"
//                     className="w-32 h-32 rounded-2xl"
//                   />
//                 ) : (
//                   <div className="text-center flex">
//                     <img src={LogoIcon} alt="Download" className="mr-3" />
//                     Logo
//                   </div>
//                 )}
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={handleLogoChange}
//                   className="absolute opacity-0 cursor-pointer w-full h-full"
//                 />
//                 {formErrors.logo && (
//                   <p className="text-red-500 text-xs absolute -bottom-5 left-0 w-full text-center">
//                     {formErrors.logo}
//                   </p>
//                 )}
//               </div>
//             </div>

//             <div className="w-full flex flex-col md:flex-row justify-between space-y-4 md:space-y-0 ">
//               <div className="w-full md:w-auto">
//                 <h2 className="text-xl font-bold mb-4">INVOICE</h2>
//                 <input
//                   type="number"
//                   className="border rounded p-2 w-16 text-center"
//                   value={invoiceNumber}
//                   onChange={(e) => setInvoiceNumber(e.target.value)}
//                 />

//                 <div className="mb-4 mt-4 md:flex-row md:space-y-0">
//                   <div className="w-full md:w-44">
//                     <textarea
//                       className="p-2 border rounded text-sm w-full"
//                       placeholder="Customer name"
//                       rows="1"
//                       value={customerdetails.customerName}
//                       onChange={(e) =>
//                         setCustomerdetails({
//                           ...customerdetails,
//                           customerName: e.target.value,
//                         })
//                       }
//                     />
//                     {/* Display error below the textarea */}
//                     {formErrors.customerName && (
//                       <p className="text-red-500 text-xs mt-1">
//                         {formErrors.customerName}
//                       </p>
//                     )}
//                   </div>

//                   <div className="w-full md:w-44">
//                     <textarea
//                       placeholder="Ship To (optional)"
//                       className="p-2 border rounded text-sm w-full"
//                       rows="1"
//                       value={customerdetails.shipTo}
//                       onChange={(e) =>
//                         setCustomerdetails({
//                           ...customerdetails,
//                           shipTo: e.target.value,
//                         })
//                       }
//                     />
//                     {/* Display error below the textarea */}
//                     {formErrors.shipTo && (
//                       <p className="text-red-500 text-xs mt-1">
//                         {formErrors.shipTo}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               <div className="space-y-3 md:place-items-start">
//                 <div className="flex items-center space-x-2 mt-10">
//                   <label className="w-24 text-sm text-txt-gray">Date</label>
//                   <input
//                     type="date"
//                     name="date"
//                     value={companyData.date}
//                     className="border rounded p-2 flex-1 h-9"
//                     onFocus={(e) => (e.target.style.color = "black")}
//                     onChange={handleChange2}
//                   />
//                 </div>
//                 <div className="ml-28">
//                   {formErrors.date && (
//                     <p className="text-red-500 text-xs">{formErrors.date}</p>
//                   )}
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <label className="w-24 text-sm text-txt-gray">Due Date</label>
//                   <input
//                     type="date"
//                     name="dueDate"
//                     className="border rounded p-2 flex-1 h-9"
//                     onFocus={(e) => (e.target.style.color = "black")}
//                     onChange={handleChange2}
//                     value={companyData.dueDate}
//                   />
//                 </div>
//                 <div className="ml-28">
//                   {formErrors.dueDate && (
//                     <p className="text-red-500 text-xs">{formErrors.dueDate}</p>
//                   )}
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <label className="w-24 text-sm text-txt-gray">
//                     Phone Number
//                   </label>
//                   <input
//                     type="tel"
//                     className="border rounded p-2 flex-1 h-9"
//                     maxLength="10"
//                     name="phoneNumber"
//                     onChange={handleChange2}
//                     value={companyData.phoneNumber}
//                   />
//                 </div>
//                 <div className="ml-28">
//                   {formErrors.phoneNumber && (
//                     <p className="text-red-500 text-xs">
//                       {formErrors.phoneNumber}
//                     </p>
//                   )}
//                 </div>
//               </div>
//             </div>

//             <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-4">
//               <div className="overflow-x-auto">
//                 <table className="w-full border-collapse">
//                   <thead className="rounded-t-2xl border">
//                     <tr className="bg-[#5578cf] text-white">
//                       <td className="px-4 py-2 rounded-tl-lg" colSpan="3">
//                         Item
//                       </td>
//                       <td className="px-4 py-2 w-24">Quantity</td>
//                       <td className="px-4 py-2 w-24">Rate</td>
//                       <td className="px-4 py-2 w-20">Amount</td>
//                       <td className="px-4 py-2 rounded-tr-lg"></td>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {items.map((item, index) => (
//                       <tr
//                         key={item.id}
//                         className={`border-t ${
//                           index % 2 === 0 ? "bg-[#afc1ec]" : "bg-[#acb6d4]"
//                         } text-white`}
//                       >
//                         <td className="p-2 text-black" colSpan="3">
//                           <input
//                             type="text"
//                             name="name"
//                             value={item.name}
//                             onChange={(e) => handleChange(index, e)}
//                             className="w-full border rounded p-1"
//                             placeholder="name of item/service..."
//                           />
//                           {formErrors[`name-${index}`] && (
//                             <p className="text-red-500 text-xs mt-1">
//                               {formErrors[`name-${index}`]}
//                             </p>
//                           )}
//                         </td>
//                         <td className="border-t px-2 py-1 text-black">
//                           <input
//                             type="number"
//                             name="quantity"
//                             value={item.quantity}
//                             onChange={(e) => handleChange(index, e)}
//                             className="w-24 border rounded p-1 text-center"
//                             placeholder="1"
//                           />
//                           {formErrors[`quantity-${index}`] && (
//                             <p className="text-red-500 text-xs mt-1">
//                               {formErrors[`quantity-${index}`]}
//                             </p>
//                           )}
//                         </td>
//                         <td className="border-t px-2 py-1 text-black">
//                           <input
//                             type="number"
//                             name="rate"
//                             value={item.rate}
//                             onChange={(e) => handleRate(index, e)}
//                             className="w-24 border rounded p-1 text-center"
//                           />
//                           {formErrors[`rate-${index}`] && (
//                             <p className="text-red-500 text-xs mt-1">
//                               {formErrors[`rate-${index}`]}
//                             </p>
//                           )}
//                         </td>
//                         <td className="px-4 py-1 w-20 text-black">
//                           {selectedCurrency.symbol}{" "}
//                           {(item.quantity * item.rate).toFixed(2)}
//                         </td>
//                         <td className="px-2 py-1">
//                           <span
//                             className="text-red-500 cursor-pointer text-xl"
//                             onClick={() => removeItem(index)}
//                           >
//                             ×
//                           </span>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//               <button
//                 className="bg-white text-custom-blue border-custom-blue px-2 py-1 rounded btn-large ml-3"
//                 onClick={addItem}
//               >
//                 + Item
//               </button>
//             </div>

//             <div className="flex justify-between flex-col md:flex-row">
//               <div className="space-y-8">
//                 <div className="flex space-x-4 mt-6">
//                   <div className="flex text-right">
//                     <div className="text-base text-gray-500">Notes</div>
//                     <textarea
//                       className="block border rounded p-2 w-full text-gray-950 ml-4"
//                       placeholder="Additional notes here"
//                       onChange={(e) => setNotes(e.target.value)}
//                       value={notes}
//                     />
//                   </div>
//                 </div>
//                 <div className="flex space-x-4 mt-4">
//                   <div className="flex text-right">
//                     <div className="text-base text-gray-500">Terms</div>
//                     <textarea
//                       className="block border rounded p-2 w-full text-gray-950 ml-4"
//                       onChange={(e) => setTerms(e.target.value)}
//                       placeholder="Terms and conditions here"
//                       value={terms}
//                     />
//                   </div>
//                 </div>

//                 <div className="flex justify-end space-x-4 mt-4">
//                   <button
//                     className="px-4 py-2 w-48 text-gray-500 rounded border border-red-100 "
//                     onClick={openModal}
//                   >
//                     {savedSignature ? (
//                       <img
//                         src={
//                           typeof savedSignature === "string"
//                             ? savedSignature
//                             : URL.createObjectURL(savedSignature)
//                         }
//                         alt="Saved Signature"
//                         className="h-12"
//                       />
//                     ) : (
//                       "Add Signature"
//                     )}
//                   </button>
//                 </div>
//                 <div className="flex justify-end  mr-10">
//                   {formErrors.signlogo && (
//                     <p className="text-red-500 text-xs">
//                       {formErrors.signlogo}
//                     </p>
//                   )}
//                 </div>
//               </div>
//               <div>
//                 <div className="justify-items-end space-x-4 mb-4 mt-4">
//                   <div className="flex text-right">
//                     <div className="text-base text-gray-500">Subtotal</div>
//                     <div className="text-base text-gray-500 ml-10">
//                       {subtotal.toFixed(2)}
//                     </div>
//                   </div>
//                 </div>
//                 <div className=" justify-items-end space-x-4 mt-4">
//                   <div className="flex text-right">
//                     <div className="text-base mt-1 text-gray-500">Tax</div>
//                     <div className="flex items-center space-x-2 ml-5">
//                       <input
//                         type="number"
//                         value={taxRate}
//                         className="border rounded px-2 py-1 w-16"
//                         onChange={handleChange55}
//                         onBlur={handleBlur}
//                         disabled={!isEditable1}
//                       />
//                       <span>%</span>
//                     </div>
//                   </div>
//                 </div>

//                 <div className=" justify-items-end space-x-4 mt-4">
//                   {/* Buttons */}
//                   <div className="flex text-right">
//                     {!showDiscount && (
//                       <button
//                         onClick={() => setShowDiscount(true)}
//                         className="text-blue-500 underline cursor-pointer"
//                       >
//                         + Discount
//                       </button>
//                     )}
//                     {!showShipping && (
//                       <button
//                         onClick={() => setShowShipping(!showShipping)}
//                         className="text-blue-500 underline cursor-pointer ml-8"
//                       >
//                         + Shipping
//                       </button>
//                     )}
//                   </div>
//                 </div>

//                 <div className=" justify-items-end space-x-4 mt-4">
//                   {showDiscount && (
//                     <div className="mt-4">
//                       <label htmlFor="discount" className="block text-gray-500">
//                         Enter Discount:
//                       </label>
//                       <input
//                         type="text"
//                         id="discount"
//                         placeholder="Enter discount"
//                         className="border border-gray-500 rounded p-2 w-full mt-2"
//                         value={discount}
//                         onChange={handleChange56}
//                         onBlur={handleBlur2}
//                         disabled={!isEditable2}
//                       />
//                     </div>
//                   )}

//                   {/* Shipping Input Field */}
//                   {showShipping && (
//                     <div className="mt-4">
//                       <label htmlFor="shipping" className="block text-gray-500">
//                         Enter Shipping:
//                       </label>
//                       <input
//                         type="text"
//                         id="shipping"
//                         placeholder="Enter shipping"
//                         className="border border-gray-300 rounded p-2 w-full mt-2"
//                         value={shipping}
//                         onChange={handleChange57}
//                         onBlur={handleBlur3}
//                         disabled={!isEditable3}
//                       />
//                     </div>
//                   )}
//                 </div>

//                 <div className=" justify-items-end space-x-4 mt-4">
//                   <div className="flex text-right">
//                     <div className="text-base text-gray-500">Total</div>
//                     <div className="text-base text-gray-500 ml-7 flex ">
//                       {selectedCurrency.symbol}
//                       <h6 className="ml-2">{total2.toFixed(2)}</h6>
//                     </div>
//                   </div>
//                 </div>

//                 <div className=" justify-items-end space-x-4 mt-4">
//                   <div className="flex text-right">
//                     <div className="text-base  text-gray-500">Amount Paid</div>
//                     <input
//                       type="number"
//                       value={amountPaid}
//                       className="border rounded px-2 py-1 w-24 text-base  text-gray-500 ml-4"
//                       onChange={handleAmountPaidChange}
//                     />
//                   </div>
//                 </div>

//                 <div className=" justify-items-end space-x-4 mt-4">
//                   <div className="flex text-right">
//                     <div className="text-base  text-gray-500   ">
//                       Balance Due
//                     </div>
//                     <div className="text-base  text-gray-500 ml-7 flex ">
//                       {selectedCurrency.symbol}{" "}
//                       <h6 className="ml-2">{balanceDue.toFixed(2)}</h6>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {isModalOpen && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//                   <div className="bg-white w-[400px] rounded-lg p-6 shadow-lg relative">
//                     <button
//                       onClick={closeModal}
//                       className="absolute top-4 right-4 text-gray-700 hover:text-gray-900"
//                       aria-label="Close"
//                     >
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         strokeWidth={2}
//                         stroke="currentColor"
//                         className="w-6 h-6"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           d="M6 18L18 6M6 6l12 12"
//                         />
//                       </svg>
//                     </button>

//                     <h2 className="text-lg font-bold mb-4 text-gray-900">
//                       Signature
//                     </h2>
//                     {!isSignatureSaved ? (
//                       <SignatureCanvas
//                         ref={signaturePadRef}
//                         penColor="black"
//                         backgroundColor="#F6F8F9"
//                         canvasProps={{
//                           width: 310,
//                           height: 120,
//                           className: "signature-canvas my-4 border",
//                         }}
//                       />
//                     ) : (
//                       <img
//                         src={URL.createObjectURL(savedSignature)}
//                         alt="Saved Signature"
//                         className="my-4 border rounded"
//                         style={{ width: 300, height: 120 }}
//                         name="signlogo"
//                       />
//                     )}
//                     <div className="flex justify-between items-center mt-4">
//                       {!isSignatureSaved && (
//                         <>
//                           <button
//                             onClick={clearSignature}
//                             className="px-6 py-2 bg-custom-blue text-white text-base rounded"
//                           >
//                             Clear
//                           </button>
//                           <button
//                             onClick={saveSignature}
//                             className="ml-6 px-6 py-2 bg-custom-blue text-white text-base rounded"
//                           >
//                             Save
//                           </button>
//                           <label
//                             htmlFor="uploadSignature"
//                             className="ml-6 px-6 py-2 bg-custom-blue text-white text-base rounded cursor-pointer"
//                           >
//                             Upload
//                           </label>
//                           <input
//                             type="file"
//                             id="uploadSignature"
//                             accept="image/*"
//                             onChange={handleImageUpload}
//                             style={{ display: "none" }}
//                             name="signlogo"
//                           />
//                         </>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//           <div className="w-full md:w-1/4 pl-0 md:pl-6 border-t md:border-t-0 md:border-l mt-6 md:mt-0">
//             <div className="mb-8">
//               <button
//                 onClick={downloadInvoicePdf}
//                 className="bg-[#5578cf] text-white py-3 px-16 rounded shadow flex items-center w-full md:w-auto hover:bg-[#5d80d8]"
//               >
//                 <img src={downloadIcon} alt="Download" className="mr-4" />
//                 Download
//               </button>
//             </div>
//             <div className="mb-8">
//               {!id && (
//                 <button
//                   onClick={handleCreateInvoice}
//                   className="text-gray-500 py-3 px-16 rounded shadow flex items-center w-full md:w-auto"
//                 >
//                   <img src={SaveIcon} alt="Save Draft" className="mr-4" /> Save
//                   Draft
//                 </button>
//               )}
//             </div>
//             <div className="mb-8">
//               <label
//                 htmlFor="currency"
//                 className="block mb-2 text-base font-medium   "
//               >
//                 Currency
//               </label>
//               <select
//                 id="currency"
//                 name="currency"
//                 className="border rounded p-2 px-4 w-full text-gray-700   mt-2"
//                 onChange={handleCurrencyChange}
//                 value={selectedCurrency.code}
//               >
//                 {Object.entries(baseRates).map(([currency, { symbol }]) => (
//                   <option key={currency} value={currency}>
//                     {currency} ({symbol})
//                   </option>
//                 ))}
//               </select>
//             </div>
//             {/* Edit Your Details */}
//             <div className="mb-8">
//               <button
//                 className="flex items-center w-full md:w-auto"
//                 onClick={handleUpdateInvoice}
//               >
//                 <img src={EditIcon} alt="Edit Your Details" className="mr-4" />{" "}
//                 Edit Your Details
//               </button>
//             </div>
//             {/* Clear Data */}
//             <div>
//               <button
//                 className="flex items-center text-custom-blue w-full md:w-auto"
//                 onClick={clearData}
//               >
//                 <img src={DeleteIcon} alt="Clear Data" className="mr-3" /> Clear
//                 Data
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );

// };

// export default Custom;

// import React, { useState } from "react";
// import { AiOutlineDelete } from "react-icons/ai";
// import logoIcon from "../../images/Group.svg"
// const Custom = () => {
//   const [rows, setRows] = useState([{ item: "", rate: 0, qty: 0, amount: 0 }]);

//   const [tax, setTax] = useState(50);
//   const [discount, setDiscount] = useState(50);
//   const [billedTo, setBilledTo] = useState("");
//   const [paymentMethod, setPaymentMethod] = useState("");

//   const addRow = () => {
//     setRows([...rows, { item: "", rate: 0, qty: 0, amount: 0 }]);
//   };

//   const updateRow = (index, field, value) => {
//     const updatedRows = [...rows];
//     updatedRows[index][field] = value;

//     if (field === "rate" || field === "qty") {
//       updatedRows[index].amount =
//         updatedRows[index].rate * updatedRows[index].qty;
//     }

//     setRows(updatedRows);
//   };

//   const removeRow = (index) => {
//     const updatedRows = rows.filter((_, rowIndex) => rowIndex !== index);
//     setRows(updatedRows);
//   };

//   const calculateSubtotal = () => {
//     return rows.reduce((total, row) => total + row.amount, 0);
//   };

//   const totalDue = calculateSubtotal() + tax - discount;

//   return (
//     <div className="p-8 bg-[#f8f5f2] min-h-screen font-serif">
//       <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg">
//       <div className="flex justify-between m-10">
//           <h1 className="text-5xl font-bold items-center font-sans">Invoice</h1>
//           <img src={logoIcon} alt="Logo" className="text-6xl font-bold items-center font-sans h-14 pr-1"/>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 bg-[#e9d2c7]">
//           <div className="p-4 rounded">
//             <p>
//               <strong>Billing:</strong>
//             </p>
//             <div className="flex items-center space-x-2">
//               <label htmlFor="invoiceNo">Invoice No:</label>
//               <input
//                 type="text"
//                 id="invoiceNo"
//                 className="p-1 border rounded"
//               />
//             </div>
//             <div className="flex items-center space-x-2 mt-2">
//               <label htmlFor="invoiceDate">Invoice Date:</label>
//               <input
//                 type="date"
//                 id="invoiceDate"
//                 className="p-1 border rounded"
//               />
//             </div>
//           </div>
//           <div className="p-4 rounded">
//             <p>
//               <strong>Shipping:</strong>
//             </p>
//             <div className="flex items-center space-x-2">
//               <label htmlFor="shippingAddress">Address:</label>
//               <input
//                 type="text"
//                 id="shippingAddress"
//                 className="p-1 border rounded "
//               />
//             </div>
//           </div>
//         </div>

//         <div className="overflow-x-auto">
//           <table className="w-full border-collapse">
//             <thead>
//               <tr className="bg-[#464039] text-white">
//                 <th className="p-2">No</th>
//                 <th className="p-2">Item</th>
//                 <th className="p-2">Rate</th>
//                 <th className="p-2">Qty</th>
//                 <th className="p-2">Amount</th>
//                 <th className="p-2"></th>
//               </tr>
//             </thead>
//             <tbody>
//               {rows.map((row, index) => (
//                 <tr key={index} className="bg-[#bdb7b2]">
//                   <td className="p-2 text-center">{index + 1}</td>
//                   <td className="p-2">
//                     <input
//                       type="text"
//                       value={row.item}
//                       onChange={(e) => updateRow(index, "item", e.target.value)}
//                       className="w-full p-1 border rounded"
//                     />
//                   </td>
//                   <td className="p-2">
//                     <input
//                       type="number"
//                       value={row.rate}
//                       onChange={(e) =>
//                         updateRow(
//                           index,
//                           "rate",
//                           parseFloat(e.target.value) || 0
//                         )
//                       }
//                       className="w-full p-1 border rounded"
//                     />
//                   </td>
//                   <td className="p-2">
//                     <input
//                       type="number"
//                       value={row.qty}
//                       onChange={(e) =>
//                         updateRow(index, "qty", parseFloat(e.target.value) || 0)
//                       }
//                       className="w-full p-1 border rounded"
//                     />
//                   </td>
//                   <td className="p-2 text-center">{row.amount}</td>
//                   <td className="p-2 text-center">
//                     <button
//                       onClick={() => removeRow(index)}
//                       className="text-black hover:text-[#464039]"
//                     >
//                       <AiOutlineDelete className="w-6 h-6" />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         <button
//           onClick={addRow}
//           className="mt-6 px-6 py-2 bg-[#f3e6e0] text-black font-semibold rounded hover:bg-[#4b4945] hover:text-white"
//         >
//           Add Row
//         </button>

//         <div className="mt-8 flex flex-col items-end space-y-2 text-lg">
//           <div className="flex justify-between w-60">
//             <p>Sub Total:</p>
//             <p className="w-16 p-2">{calculateSubtotal()}</p>
//           </div>
//           <div className="flex justify-between w-60">
//             <p>Tax:</p>
//             <input
//               type="number"
//               value={tax}
//               onChange={(e) => setTax(parseFloat(e.target.value) || 0)}
//               className="w-20 p-2 border rounded text-center"
//             />
//           </div>
//           <div className="flex justify-between w-60">
//             <p>Discount:</p>
//             <input
//               type="number"
//               value={discount}
//               onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
//               className="w-20 p-2 border rounded text-center"
//             />
//           </div>
//           <div className="flex justify-between w-60 font-bold">
//             <p>Total Due:</p>
//             <p className="w-16 p-2">{totalDue}</p>
//           </div>
//         </div>

//         <div className="mt-8">
//           <div className="mb-4">
//             <label className="block text-sm font-medium">Billed To:</label>
//             <input
//               type="text"
//               value={billedTo}
//               onChange={(e) => setBilledTo(e.target.value)}
//               className="border border-gray-300 p-3 rounded"
//             />
//           </div>

//           <div className="mb-4">
//             <label className="block text-sm font-medium">Payment Method:</label>
//             <input
//               type="text"
//               value={paymentMethod}
//               onChange={(e) => setPaymentMethod(e.target.value)}
//               className="border border-gray-300 p-3 rounded"
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Custom;

import React, { useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
const Custom = () => {
  const [invoiceData, setInvoiceData] = useState({
    customerName: "",
    email: "",
    address: "",
    phone: "",
    date: new Date().toLocaleDateString(),
  });

  const [items, setItems] = useState([
    { description: "", qty: 1, price: 0, total: 0 },
  ]);
  const [tax, setTax] = useState(10);
  const [discount, setDiscount] = useState(10);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInvoiceData({ ...invoiceData, [name]: value });
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] =
      field === "qty" || field === "price" ? parseFloat(value) || 0 : value;
    updatedItems[index].total =
      updatedItems[index].qty * updatedItems[index].price;
    setItems(updatedItems);
  };

  const addRow = () => {
    setItems([...items, { description: "", qty: 1, price: 0, total: 0 }]);
  };

  const deleteRow = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };
  const calculateSubtotal = () => {
    return items.reduce((total, row) => total + row.total, 0);
  };
  const totalDue = calculateSubtotal() + tax - discount;

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-md font-sans mt-10">
      <div className="flex items-center h-28 bg-[#a37b62]">
        <div className="bg-[#a37b62] h-28 text-white flex-1 flex items-center justify-center">
          <h1 className="text-2xl font-bold">Borcelle Shop</h1>
        </div>

        <div className="relative w-[50px] h-full">
          <svg
            className="w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 50 320"
            preserveAspectRatio="none"
          >
            <path
              d="M0,0 C25,80 25,240 0,320 L50,320 L50,0 Z"
              fill="#423832"
            ></path>
          </svg>
        </div>

        <div className="bg-[#423832] text-white flex-1 flex items-center justify-center h-28">
          <h2 className="text-3xl font-bold">Invoice</h2>
        </div>
      </div>

      <div className="p-6 bg-white">
        <h3 className="font-semibold text-lg">Invoice To:</h3>
        <div className="flex justify-between mb-4">
          <div>
            <input
              type="text"
              name="customerName"
              value={invoiceData.customerName}
              onChange={handleInputChange}
              placeholder="Customer Name"
              className="block border border-gray-300 rounded p-1 mb-2 w-full"
            />
            <input
              type="email"
              name="email"
              value={invoiceData.email}
              onChange={handleInputChange}
              placeholder="Email"
              className="block border border-gray-300 rounded p-1 mb-2 w-full"
            />
            <input
              type="text"
              name="address"
              value={invoiceData.address}
              onChange={handleInputChange}
              placeholder="Address"
              className="block border border-gray-300 rounded p-1 mb-2 w-full"
            />
          </div>
          <div className="text-right">
            <input
              type="text"
              name="destination"
              value={invoiceData.address}
              onChange={handleInputChange}
              placeholder="Address"
              className="block border border-gray-300 rounded p-1 mb-2 w-full"
            />
            <input
              type="tel"
              name="phone"
              value={invoiceData.phone}
              onChange={handleInputChange}
              placeholder="Phone"
              className="block border border-gray-300 rounded p-1 mb-2 w-full"
            />
            <input
              type="date"
              name="date"
              value={invoiceData.date}
              onChange={handleInputChange}
              className="block border border-gray-300 rounded p-1 mb-2 w-full"
            />
          </div>
        </div>

        <table className="w-full text-left  mb-6">
          <thead>
            <tr className="bg-[#2e2a28] text-white">
              <th>
                <p className="bg-[#a37b62]  text-white py-2 px-6 rounded-r-full">
                  Description
                </p>
              </th>
              <th className="py-2 px-6 bg-[#2e2a28] text-white">Qty</th>
              <th className="py-2 px-6 bg-[#2e2a28] text-white">Price</th>
              <th className="py-2 px-6 bg-[#2e2a28] text-white">Total</th>
              <th className="py-2 px-6 bg-[#2e2a28] text-white"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="py-2 px-4 w-80">
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) =>
                      handleItemChange(index, "description", e.target.value)
                    }
                    placeholder="Item Description"
                    className="border border-gray-300 rounded p-1 w-full"
                  />
                </td>
                <td className="py-2 px-4 w-32">
                  <input
                    type="number"
                    value={item.qty}
                    onChange={(e) =>
                      handleItemChange(index, "qty", e.target.value)
                    }
                    className="border border-gray-300 rounded p-1 w-full"
                  />
                </td>
                <td className="py-2 px-4 w-32">
                  <input
                    type="number"
                    value={item.price}
                    onChange={(e) =>
                      handleItemChange(index, "price", e.target.value)
                    }
                    className="border border-gray-300 rounded p-1 w-full"
                  />
                </td>
                <td className="py-2 px-4 w-32">${item.total.toFixed(2)}</td>
                <td className="p-2 text-center">
                  <button
                    onClick={() => deleteRow(index)}
                    className="text-black hover:text-[#464039]"
                  >
                    <AiOutlineDelete className="w-6 h-6" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          onClick={addRow}
          className="bg-[#2e2a28] hover:bg-[#a37b62] text-white px-4 py-1.5 rounded"
        >
          Add Row
        </button>

        <div className="mt-8 flex flex-col items-end  text-lg">
          <div className="flex justify-between w-60">
            <p>Sub Total:</p>
            <p className="w-16 p-2">{calculateSubtotal()}</p>
          </div>
          <div className="flex justify-between w-60">
            <p>Tax:</p>
            <input
              type="number"
              value={tax}
              onChange={(e) => setTax(parseFloat(e.target.value) || 0)}
              className="w-20 p-2 border rounded text-center"
            />
          </div>
          <div className="flex justify-between w-60">
            <p>Discount:</p>
            <input
              type="number"
              value={discount}
              onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
              className="w-20 p-2 border rounded text-center"
            />
          </div>
          <div className="flex justify-between w-80 font-bold text-white bg-[#423832] rounded-l-full">
            <p className="p-2 ml-[70px]">Total Due:</p>
            <p className="p-2 mr-[30px]">{totalDue}</p>
          </div>
        </div>
      </div>

      <div className="w-60">
        <label>Notes : </label>
        <input
          type="text"
          name="notes"
          value={invoiceData.customerName}
          onChange={handleInputChange}
          placeholder="Notes"
          className="block border border-gray-300 rounded p-1 mb-2 w-full"
        />
        <label>Terms : </label>
        <input
          type="text"
          name="terms"
          value={invoiceData.customerName}
          onChange={handleInputChange}
          placeholder="Terms and Conditions"
          className="block border border-gray-300 rounded p-1 mb-2 w-full"
        />
      </div>
      <div className="bg-[#423832] text-white p-4 text-center text-3xl rounded-2xl mt-5">
        <p> Thank you ! </p>
      </div>
    </div>
  );
};

export default Custom;
