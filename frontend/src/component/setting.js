import React, { useState } from "react";

const SettingsPage = () => {
  const [isEditing, setIsEditing] = useState(false); // To toggle edit mode
  const [invoiceNumber, setInvoiceNumber] = useState(100); // To store the invoice number
  const [isEditable, setIsEditable] = useState(true); // To track if editing is allowed

  const [showModal, setShowModal] = useState(false); // Toggle modal visibility
  const [apiKey, setApiKey] = useState("grgrgergsgefsgdfdhcbt"); // Mock API key
  const [apiKeys, setApiKeys] = useState([]); // State for storing API keys

  // Function to open/close modal
  const toggleModal = () => {
    setShowModal((prev) => !prev);
  };

  // Function to handle the Edit/Save button click
  const handleEditClick = () => {
    if (isEditing) {
      setIsEditable(false); // Disable further editing after saving
    }
    setIsEditing((prev) => !prev); // Toggle between Edit and Save mode
  };

  // Function to handle changes in the invoice number input
  const handleInputChange = (e) => {
    setInvoiceNumber(e.target.value);
  };

  // Function to handle save API key
  const handleSaveApiKey = () => {
    const newApiKey = {
      label: `Untitled API Key (${new Date().toISOString()})`,
      key: apiKey,
      date: new Date().toLocaleString(),
    };
    setApiKeys([...apiKeys, newApiKey]);
    toggleModal(); // Close the modal after saving
  };

  // Function to handle removal of an API key
  const handleRemoveApiKey = (index) => {
    setApiKeys(apiKeys.filter((_, i) => i !== index));
  };

  return (
    <div className="flex justify-center   dark:bg-black">
      <div className="w-full max-w-6xl rounded-lg shadow-md p-8">
        {/* Header Section */}
        <div className="bg-gray-50 dark:bg-bg-gray">
          <div className="text-center mb-6 p-4">
            <h1 className="text-gray-700 text-xl p-3 dark:text-tl-gray">
              Manage your settings here, including how you want to get paid.
            </h1>
            <h2 className="text-5xl font-bold text-gray-800 mt-2 flex items-center justify-center dark:text-white">
              Settings{" "}
            </h2>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-2">
            {/* Invoicing Settings */}
            <div className="p-6 rounded-lg text-center m-2">
              <h3 className="text-custom-blue font-medium text-2xl mb-3 ">
                Invoicing Settings
              </h3>
              <p className="text-gray-700 text-base mb-7 dark:text-tl-gray ">Next Invoice Number:</p>

              {/* Conditionally Render Input or Static Text */}
              {isEditing ? (
                <input
                  type="number"
                  value={invoiceNumber}
                  onChange={handleInputChange}
                  className="text-2xl font-bold text-gray-900 mb-7 p-2 border rounded w-32 mx-auto text-center dark:text-white dark:bg-bg-gray dark:border-gray-600"
                />
              ) : (
                <p className="text-2xl font-bold text-gray-900 mb-7 dark:text-white">
                  {invoiceNumber}
                </p>
              )}

              {/* Edit/Save Button */}
              <button
                onClick={handleEditClick}
                className={`${
                  isEditable
                    ? "hover:bg-white bg-custom-blue text-white hover:text-custom-blue  hover:border-custom-blue"
                    : "bg-gray-200 cursor-not-allowed text-black"
                }  px-16 py-2 rounded-full transition w-full`}
                disabled={!isEditable} // Disable button if editing is no longer allowed
              >
                {isEditing ? "Save" : "Edit"}
              </button>
            </div>

            {/* Payment Settings */}
            <div className="p-6 rounded-lg text-center relative m-2">
              <h3 className="text-custom-blue font-medium text-2xl mb-2">
                Payment Settings
              </h3>
              <p className="text-gray-700 text-base mb-5 mx-6 px-4 dark:text-tl-gray">
                You need to finish setting up your Stripe account in order to
                process payments.
              </p>
              <button className="bg-gray-50 border-red-600 text-red-600 px-14 py-1 rounded-full hover:bg-red-600 hover:text-white transition border mb-4">
                Action Required
              </button>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition w-full">
                Complete Onboarding
              </button>
            </div>
          </div>
        </div>

        {/* API Keys Section */}
        {/* <div className="mx-6 mt-0 flex">
          <div>
            <h3 className="text-custom-blue font-medium text-xl mb-3">API Keys</h3>
            <p className="text-gray-600 text-base mb-4">
              You do not have any API keys set. If you would like to use the
              Invoice-Generator.com API then you must create an API key.
            </p>
          </div>
          <div className="mt-6 ml-8">
            <button
              onClick={toggleModal}
              className="border border-gray-400 text-gray-700 px-6 py-2 rounded-full hover:bg-gray-100 transition"
            >
              + New API Key
            </button>
           
            {showModal && (
              <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
                  <h3 className="text-xl font-semibold mb-4">API Key</h3>
                  <div className="bg-blue-50 text-blue-600 text-center p-2 rounded mb-4">
                    API Key Has Been Added.
                  </div>

                 
                  <div className="mb-4">
                    <label className="block text-gray-600 text-sm mb-2">Key Label</label>
                    <input
                      type="text"
                      value={`Untitled API Key (${new Date().toISOString()})`}
                      className="w-full border border-gray-300 p-2 rounded"
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-gray-600 text-sm mb-2">API Key:</label>
                    <div className="flex items-center">
                      <input
                        type="text"
                        value={apiKey}
                        className="w-full border border-gray-300 p-2 rounded"
                      />
                      <button
                        onClick={() => navigator.clipboard.writeText(apiKey)}
                        className="bg-blue-600 text-white px-4 py-2 rounded ml-2 hover:bg-blue-700"
                      >
                        Copy
                      </button>
                    </div>
                  </div>

                
                  <div className="flex justify-end space-x-4">
                    <button
                      onClick={toggleModal}
                      className="border border-gray-400 text-gray-700 px-4 py-2 rounded hover:bg-gray-100 transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveApiKey}
                      className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div> */}

    
        <div className="mt-8 mx-6">
          {apiKeys.map((key, index) => (
            <div
              key={index}
              className="flex justify-between items-center bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4"
            >
              <div>
                <p className="text-gray-700 font-semibold">{key.label}</p>
                <p className="text-gray-500">{key.date}</p>
              </div>
              <button
                onClick={() => handleRemoveApiKey(index)}
                className="text-red-500 hover:text-red-700 transition"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
