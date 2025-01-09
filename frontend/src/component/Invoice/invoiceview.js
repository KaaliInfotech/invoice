import React, { useEffect, useState } from "react";
import axios from "axios";

const Invoiceview = () => {
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5001/api/invoice/invoiceSingleView/676d3477e301235a457952c3",
        );
        console.log(response,">>>>>>>>>>>>>>");
        
        setInvoice(response.data.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching invoice data:", error);
        setLoading(false);
      }
    };

    fetchInvoice();


  }, []);

  if (loading) {
    return <div className="text-center py-10">Loading Invoice...</div>;
  }

  const baseURL = "http://localhost:5001/api";
  const logoPath = invoice?.logo.replace("\\", "/");
  const logoURL = `${baseURL}/${logoPath}`;

  return (
    <div className="bg-gray-50 p-6">
      {/* Google Translate Dropdown */}

      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">

        <div className="p-6 bg-gray-100 flex justify-between items-center">
          <img src={logoURL} alt="Logo" className="h-20 w-20 object-cover" />
          <div className="text-right">
            <h1 className="text-2xl font-bold">
              Invoice #{invoice.invoiceDetails.invoiceNumber}
            </h1>
            <p className="text-gray-500">
              Date:{" "}
              {new Date(invoice.invoiceDetails.date).toLocaleDateString()}
              <br />
              Due Date:{" "}
              {new Date(invoice.invoiceDetails.dueDate).toLocaleDateString()}
              <br />
              Payment Terms: {invoice.invoiceDetails.paymentTerms}
            </p>
          </div>
        </div>

        {/* Company Details */}
        <div className="p-6">
          <div className="flex justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-700">From</h2>
              <p className="text-gray-500">{invoice.companyDetails.from}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-700">To</h2>
              <p className="text-gray-500">{invoice.companyDetails.to}</p>
            </div>
            {invoice.companyDetails.shipTo && (
              <div>
                <h2 className="text-lg font-semibold text-gray-700">Ship To</h2>
                <p className="text-gray-500">{invoice.companyDetails.shipTo}</p>
              </div>
            )}
          </div>
        </div>

        {/* Items Table */}
        <div className="p-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b">
                <th className="p-2 text-gray-600 font-semibold">Item</th>
                <th className="p-2 text-gray-600 font-semibold text-center">
                  Quantity
                </th>
                <th className="p-2 text-gray-600 font-semibold text-center">
                  Rate
                </th>
                <th className="p-2 text-gray-600 font-semibold text-center">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item) => (
                <tr key={item._id} className="border-b">
                  <td className="p-2">{item.name}</td>
                  <td className="p-2 text-center">{item.quantity}</td>
                  <td className="p-2 text-center">{item.rate}</td>
                  <td className="p-2 text-center">{item.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="p-6 text-right">
          <p>
            Subtotal:{" "}
            <span className="font-medium">{invoice.summary.subtotal}</span>
          </p>
          <p>
            Tax: <span className="font-medium">{invoice.summary.tax}</span>
          </p>
          <p>
            Discount:{" "}
            <span className="font-medium">{invoice.summary.discount}</span>
          </p>
          <p>
            Shipping:{" "}
            <span className="font-medium">{invoice.summary.shipping}</span>
          </p>
          <h2 className="text-xl font-bold mt-2">
            Total: {invoice.summary.total}
          </h2>
          <p className="text-gray-500 mt-1">
            Amount Paid:{" "}
            <span className="font-semibold">{invoice.summary.amountPaid}</span>
          </p>
          <p
            className={`font-semibold ${
              invoice.summary.balanceDue < 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            Balance Due: {invoice.summary.balanceDue}
          </p>
        </div>

        {/* Notes & Terms */}
        <div className="p-6 bg-gray-100 text-sm text-gray-500">
          <p>
            <span className="font-semibold text-gray-700">Notes:</span>{" "}
            {invoice.notes}
          </p>
          <p className="mt-2">
            <span className="font-semibold text-gray-700">Terms:</span>{" "}
            {invoice.terms}
          </p>
        </div>

        {/* Signature Logo */}
        {invoice.signlogo && (
          <div className="p-6 text-right">
            <img
              src={`http://localhost:5001/api/${invoice.signlogo}`}
              alt="Signature Logo"
              className="h-16 inline-block"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Invoiceview;
