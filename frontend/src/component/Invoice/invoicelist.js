import React, { useEffect, useState, useRef } from "react";
import { FiDownload, FiEdit, FiTrash2, FiChevronDown } from "react-icons/fi";
import {
  changepaymentStatus,
  deleteInvoice,
  downloadpdfInvoice,
  getInvoices,
  getInvoicesFilterlist,
  searchInvoice,
} from "../../api";
import { useNavigate } from "react-router-dom";
import getUserIdFromToken from "../tokendecode";

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [tinvoices, setTInvoices] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [statusDropdown, setStatusDropdown] = useState(null);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [showCustomCalendar, setShowCustomCalendar] = useState(false);
  const [customDates, setCustomDates] = useState({
    startDate: "",
    endDate: "",
  });
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown1 = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const optionsMapping = [
    "Today",
    "Yesterday",
    "Last 7 days",
    "Last 30 days",
    "Last month",
    "This month",
    "Last year",
    "Custom",
  ];

  const handleOptionSelect = async (option) => {
    setSelectedOption(option);

    if (option === "Custom") {
      setShowCustomCalendar(true);
      setDropdownOpen(false);
      return;
    } else {
      setShowCustomCalendar(false);
    }
    const queryValue = option.toLowerCase().replace(" ", "_");
    try {
      const filteredInvoices = await getInvoicesFilterlist(queryValue);
      const userInvoices = filteredInvoices.data.filter(
        (invoice) => invoice.user_id === user.id
      );

      setInvoices(userInvoices);
      setTInvoices(userInvoices);
    } catch (error) {
      console.error("Error filtering invoices:", error);
    }
    setDropdownOpen(false);
  };

  const handleDateChange = async (e) => {
    const { name, value } = e.target;
    const updatedDates = { ...customDates, [name]: value };
    setCustomDates(updatedDates);

    if (updatedDates.startDate && updatedDates.endDate) {
      const query = `custom&startDate=${updatedDates.startDate}&endDate=${updatedDates.endDate}`;

      try {
        const filteredInvoices = await getInvoicesFilterlist(query);
        const userInvoices = filteredInvoices.data.filter(
          (invoice) => invoice.user_id === user.id
        );
        setInvoices(userInvoices);
        setTInvoices(userInvoices);
        setSelectedOption(
          `${updatedDates.startDate} - ${updatedDates.endDate}`
        );
        setShowCustomCalendar(false);
      } catch (error) {
        console.error("Error fetching invoices with custom dates:", error);
      }
    }
  };

  const user = getUserIdFromToken();
  useEffect(() => {
    const fetchdata = async () => {
      try {
        const data = await getInvoices();

        if (Array.isArray(data.data)) {
          setTInvoices(data.data);
          const matchedInvoices = data.data.filter(
            (invoice) => invoice.user_id === user.id
          );

          setInvoices(matchedInvoices);
        } else {
          console.log("No invoices found or data is not an array.");
          setTInvoices([]);
          setInvoices([]);
        }
      } catch (error) {
        console.log(error);
        setTInvoices([]);
        setInvoices([]);
      }
    };

    fetchdata();
  }, [user.id]);

  const toggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  const toggleStatusDropdown = (index) => {
    setStatusDropdown(statusDropdown === index ? null : index);
  };

  const handleStatusChange = async (invoiceId) => {
    try {
      const response = await changepaymentStatus(invoiceId);
      if (response.status === 201) {
        const updatedInvoices = tinvoices.map((invoice) =>
          invoice._id === invoiceId
            ? { ...invoice, paymentStatus: "paid" }
            : invoice
        );
        setInvoices(updatedInvoices);
        setTInvoices(updatedInvoices);
        setStatusDropdown(null);
        setOpenDropdown(null);
      }
    } catch (error) {
      console.error("Error updating payment status:", error);
    }
  };

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = date.getUTCDate();
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.getUTCFullYear();
    return `${day} ${month}, ${year}`;
  };

  const downloadInvoicePdf = async (invoiceId) => {
    try {
      const response = await downloadpdfInvoice(invoiceId);

      if (!response || !response.data) {
        throw new Error("Invalid API response: Missing base64 data");
      }
      let base64PDF = response.data;
      base64PDF = base64PDF.replace(/\s/g, "");

      base64PDF = base64PDF.replace(/^data:application\/pdf;base64,/, "");
      const binaryString = atob(base64PDF);
      const length = binaryString.length;
      const bytes = new Uint8Array(length);

      for (let i = 0; i < length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const blob = new Blob([bytes], { type: "application/pdf" });

      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);

      link.href = url;
      link.download = `invoice/id=${invoiceId}.pdf`;
      link.click();

      URL.revokeObjectURL(url);
      setOpenDropdown(null);
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  };

  const handledeleteInvoice = async (invoiceId) => {
    try {
      await deleteInvoice(invoiceId);
      const updatedInvoices = tinvoices.filter(
        (invoice) => invoice._id !== invoiceId
      );
      setInvoices(updatedInvoices);
      setTInvoices(updatedInvoices);
      setOpenDropdown(null);
    } catch (error) {
      console.log(error);
    }
  };

  const handleupdateInvoice = async (invoiceId) => {
    navigate(`/updateInvoice/${invoiceId}`);
  };

  useEffect(() => {
    const handleSearchInvoice = async () => {
      try {
        const data = await searchInvoice(searchTerm);
        setInvoices(data.data);
        const matchedInvoices = data.data.filter(
          (invoice) => invoice.user_id === user.id
        );
        setTInvoices(matchedInvoices);
      } catch (error) {
        console.log(error);
      }
    };
    handleSearchInvoice();
  }, [searchTerm]);

  return (
    <div className="p-4 md:p-8 bg-gray-50 h-full md:container md:mx-auto">
      <div className="flex flex-wrap justify-between items-center mb-4 space-y-4 md:space-y-0">
        <div className="relative inline-block" ref={dropdownRef}>
          <button
            onClick={toggleDropdown1}
            className="flex items-center  px-4 py-2 text-gray-700 "
          >
            My Invoices
            <svg
              className={`ml-2 h-5 w-5 transform transition-transform ${
                isOpen ? "rotate-180" : "rotate-0"
              }`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {isOpen && (
            <div className="absolute mt-2 w-40 bg-white border border-gray-300 rounded-md shadow-lg">
              <a
                href="/invoicelist"
                className="block px-4 py-2 text-txt-gray hover:bg-gray-100"
              >
                My Invoices
              </a>
              <a
                href="/draft"
                className="block px-4 py-2 text-txt-gray hover:bg-gray-100"
              >
                Draft
              </a>
            </div>
          )}
        </div>
        <div className="flex flex-col md:flex-row items-center md:space-x-4">
          <div className="relative w-full md:w-auto mb-2 md:mb-0">
            <div
              className="flex items-center border px-3 py-2 rounded-md text-gray-600 cursor-pointer w-full md:w-auto"
              onClick={() => setDropdownOpen(!isDropdownOpen)}
            >
              <span>
                {selectedOption
                  ? selectedOption === "Custom"
                    ? `${customDates.startDate || "Start"} - ${
                        customDates.endDate || "End"
                      }`
                    : selectedOption
                  : "Select For Filter"}
              </span>
            </div>

            {isDropdownOpen && (
              <div className="absolute mt-2 w-full md:w-48 bg-white border rounded-md shadow-md z-10">
                <ul className="py-2">
                  {optionsMapping.map((option, index) => (
                    <li
                      key={index}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleOptionSelect(option)}
                    >
                      {option}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {showCustomCalendar && (
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2">
              <input
                type="date"
                name="startDate"
                value={customDates.startDate}
                onChange={handleDateChange}
                className="border rounded-md px-3 py-2 outline-none w-full md:w-auto"
              />
              <span>to</span>
              <input
                type="date"
                name="endDate"
                value={customDates.endDate}
                onChange={handleDateChange}
                className="border rounded-md px-3 py-2 outline-none w-full md:w-auto"
              />
            </div>
          )}
          <input
            type="text"
            placeholder="Search"
            className="border rounded-md px-3 py-2 focus:ring-1 focus:ring-blue-400 outline-none  w-full md:w-auto"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="overflow-x-auto min-h-screen">
        <table className="w-full bg-white shadow-lg rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-6 text-left text-gray-600 font-medium">
                Invoice Number
              </th>
              <th className="py-3 px-6 text-left text-gray-600 font-medium">
                Customer Name
              </th>
              <th className="py-3 px-6 text-left text-gray-600 font-medium">
                Date
              </th>
              <th className="py-3 px-6 text-left text-gray-600 font-medium">
                Due Date
              </th>
              <th className="py-3 px-6 text-left text-gray-600 font-medium">
                Status
              </th>
              <th className="py-3 px-6 text-left text-gray-600 font-medium">
                Amount
              </th>
              <th className="py-3 px-6 text-center text-gray-600 font-medium">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {tinvoices.map((invoice, index) => (
              <tr key={invoice._id} className="hover:bg-gray-50">
                <td className="px-6 py-3 text-blue-500 hover:underline cursor-pointer">
                  #{invoice.invoiceDetails.invoiceNumber}
                </td>
                <td className="px-6 py-3">
                  {invoice.companyDetails.customerName}
                </td>
                <td className="px-6 py-3">
                  {formatDate(invoice.invoiceDetails.date)}
                </td>
                <td className="px-6 py-3">
                  {formatDate(invoice.invoiceDetails.dueDate)}
                </td>
                <td className="px-6 py-3">
                  {invoice.paymentStatus === "paid" ? (
                    <span className="inline-flex items-center space-x-1 bg-green-100 text-green-600 border-green-600 border rounded-full text-sm font-semibold">
                      <span className="pl-3">●</span>
                      <span className="pr-3">Paid</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center space-x-1 bg-red-100 text-red-500 border-red-500 border rounded-full text-sm font-semibold">
                      <span className="pl-3">●</span>
                      <span className="pr-3">Pending</span>
                    </span>
                  )}
                </td>
                <td className="px-6 py-3">{invoice.summary.balanceDue}</td>
                <td className="py-3 px-6 text-center relative">
                  <button
                    onClick={() => toggleDropdown(index)}
                    className="flex items-center justify-center space-x-1 text-gray-600 hover:text-blue-600"
                  >
                    <span>View</span>
                    <FiChevronDown />
                  </button>

                  {openDropdown === index && (
                    <div className="absolute top-10 right-6 bg-white shadow-lg rounded-md w-40 z-10 max-h-[300px] ">
                      <button
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 w-full"
                        onClick={() => downloadInvoicePdf(invoice._id)}
                      >
                        <FiDownload className="w-4 h-4 mr-2" />
                        Download
                      </button>
                      <button
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 w-full"
                        onClick={() => handleupdateInvoice(invoice._id)}
                      >
                        <FiEdit className="w-4 h-4 mr-2" />
                        Edit
                      </button>
                      <button
                        className="flex items-center px-4 py-2 text-red-500 hover:bg-gray-100 w-full"
                        onClick={() => handledeleteInvoice(invoice._id)}
                      >
                        <FiTrash2 className="w-4 h-4 mr-2" />
                        Delete
                      </button>
                      {invoice.paymentStatus === "pending" && (
                        <div className="relative">
                          <button
                            onClick={() => toggleStatusDropdown(index)}
                            className="flex items-center justify-between px-4 py-2 text-gray-700 hover:bg-gray-100 w-full"
                          >
                            <span>Status</span>
                            <FiChevronDown className="w-4 h-4" />
                          </button>

                          {statusDropdown === index && (
                            <div className="absolute left-0 top-full mt-1 bg-white shadow-md rounded-md w-32 z-20 border">
                              <button
                                className="flex items-center px-4 py-2 text-green-600 hover:bg-green-50 w-full"
                                onClick={() => handleStatusChange(invoice._id)}
                              >
                                Paid
                              </button>
                              <button
                                className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 w-full"
                                onClick={() => handleStatusChange(invoice._id)}
                              >
                                Pending
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </td>

                {/* <td className="py-3 px-6 text-center relative">
                  <button
                    onClick={() => toggleDropdown(index)}
                    className="flex items-center justify-center space-x-1 text-gray-600 hover:text-blue-600"
                  >
                    <span>View</span>
                    <FiChevronDown />
                  </button>

                  {openDropdown === index && (
                    <div className="absolute top-10 right-6 bg-white shadow-lg rounded-md w-40 z-10 max-h-[300px] overflow-auto">
                      <button
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 w-full"
                        onClick={() => downloadInvoicePdf(invoice._id)}
                      >
                        <FiDownload className="w-4 h-4 mr-2" />
                        Download
                      </button>
                      <button
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 w-full"
                        onClick={() => handleupdateInvoice(invoice._id)}
                      >
                        <FiEdit className="w-4 h-4 mr-2" />
                        Edit
                      </button>
                      <button
                        className="flex items-center px-4 py-2 text-red-500 hover:bg-gray-100 w-full"
                        onClick={() => handledeleteInvoice(invoice._id)}
                      >
                        <FiTrash2 className="w-4 h-4 mr-2" />
                        Delete
                      </button>
                      {invoice.paymentStatus === "pending" ? (
                        <div className="relative">
                          <button
                            onClick={() => toggleStatusDropdown(index)}
                            className="flex items-center justify-between px-4 py-2 text-gray-700 hover:bg-gray-100 w-full"
                          >
                            <span>Status</span>
                            <FiChevronDown className="w-4 h-4" />
                          </button>

                          {statusDropdown === index && (
                            <div className="absolute left-0 top-full mt-1 bg-white shadow-md rounded-md w-32 z-20 border">
                              <button
                                className="flex items-center px-4 py-2 text-green-600 hover:bg-green-50 w-full"
                                onClick={() => handleStatusChange(invoice._id)}
                              >
                                Paid
                              </button>
                              <button
                                className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 w-full"
                                onClick={() => handleStatusChange(invoice._id)}
                              >
                                Pending
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  )}
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InvoiceList;
