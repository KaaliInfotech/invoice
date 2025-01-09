import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ReactComponent as Logo } from "../images/logo.svg";
// import sunnyIcon from "../images/Group.svg";
import { FaLanguage } from "react-icons/fa6";
import upgradeIcon from "../images/upgrade.svg";
import getUserIdFromToken from "./tokendecode";

const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // const [showUpgradeMessage, setShowUpgradeMessage] = useState(false);
  const dropdownRef = useRef(null);
  const user = localStorage.getItem("token");
  const userName = getUserIdFromToken();
  

  // const invoicelength = localStorage.getItem("invoicelength");
  // useEffect(() => {
  //   if (invoicelength >= 10) {
  //     setShowUpgradeMessage(false);
  //   }
  // }, [invoicelength]);

  useEffect(() => {
    // Check if the script is already added to avoid duplication
    if (!document.getElementById("google-translate-script")) {
      const script = document.createElement("script");
      script.src =
        "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.id = "google-translate-script"; // Assign an ID to the script
      script.async = true;
      document.body.appendChild(script);

      // Initialize Google Translate
      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en", // Default language of the page
            includedLanguages: "", // Leave it empty to include all available languages
            layout:
              window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          },
          "google_translate_element"
        );
      };
    }
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleNavigateToMyAccount = () => {
    navigate("/myaccount");
    setIsDropdownOpen(false);
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("invoicelength");
    navigate("/");
    console.log("User signed out");
    setIsDropdownOpen(false);
  };

  // const closeModal = () => {
  //   setShowUpgradeMessage(false);
  // };

  const handleCreateInvoice = () => {
    // if (invoicelength >= 10) {
    // setShowUpgradeMessage(true);
    // } else {
    navigate("/");
    // }
  };

  return (
    <div>
      {user ? (
        <header className="bg-white shadow-md py-4">
          <div className="container mx-auto flex flex-row items-center justify-between px-4">
            <div className="flex-shrink-0">
              <Logo alt="Invoice Sheet Logo" onClick={() => navigate("/")}/>
            </div>
            <button
              onClick={toggleMenu}
              className="block md:hidden text-gray-900 focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>

            {!isMenuOpen && (
              <nav className="hidden md:flex flex-row space-x-6 items-center ml-10">
                {/* {showUpgradeMessage && (
                  <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm mx-auto">
                      <h3 className="text-xl text-txt-blue mb-4">
                        Upgrade Required
                      </h3>
                      <p className="text-txt-blue mb-4">
                        You have reached the limit of 5 invoices. Please upgrade
                        your account to create more invoices.
                      </p>
                      <button
                        onClick={closeModal}
                        className="bg-custom-blue text-white py-2 px-4 rounded-lg"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )} */}
                <a
                  href="#createinvoice"
                  onClick={handleCreateInvoice}
                  className={` text-txt-blue hover:text-txt-hover`}
                >
                  Create Invoice
                </a>
                <a
                  href="/invoicelist"
                  className="text-txt-blue hover:text-txt-hover"
                >
                  History
                </a>
                <a
                  className="text-txt-blue hover:text-txt-hover"
                  href="/settings"
                >
                  Settings
                </a>
                <button
                  onClick={() => navigate("/upgrade")}
                  className="bg-custom-blue text-white py-2 px-4 rounded-full hover:bg-blue-600 flex items-center"
                >
                  <img src={upgradeIcon} alt="Upgrade" className="mr-2" />
                  Upgrade
                </button>
              </nav>
            )}
            {!isMenuOpen && (
              <div className="hidden md:flex items-center space-x-4 ml-auto">
                {/* <button className="text-txt-blue hover:text-txt-hover">
                  <img src={sunnyIcon} alt="Theme Toggle" />
                </button> */}
                <div className="relative">
                  <div
                    onClick={toggleDropdown}
                    className="border rounded-full px-2 py-3 text-txt-blue text-sm hover:bg-custom-blue hover:text-white cursor-pointer dark:text-white"
                  >
                    {userName?.name} ▼
                  </div>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-52  bg-white border rounded-lg shadow-lg ">
                      <ul>
                        <li className="px-4  mt-4 text-txt-blue  cursor-pointer font-medium pl-4">
                          {userName.name}
                        </li>
                        <li className="px-4  mb-4 text-txt-gray cursor-pointer text-sm pl-4">
                          {userName.email}
                        </li>
                        <li
                          className="px-4 py-2 text-txt-gray hover:bg-gray-100 hover:text-black cursor-pointer pl-4"
                          onClick={handleNavigateToMyAccount}
                        >
                          My Account
                        </li>
                        <hr></hr>
                        <li
                          className="px-4 py-2 text-red-500 hover:bg-gray-100 cursor-pointer pl-4"
                          onClick={handleSignOut}
                        >
                          Sign Out
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          {isMenuOpen && (
            <div className="md:hidden bg-white shadow-md absolute left-0 w-full z-10">
              <nav className="flex flex-col items-start space-y-2 px-4 py-4">
                {/* {showUpgradeMessage && (
                  <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm mx-auto">
                      <h3 className="text-xl text-txt-blue mb-4">
                        Upgrade Required
                      </h3>
                      <p className="text-txt-blue mb-4">
                        You have reached the limit of 5 invoices. Please upgrade
                        your account to create more invoices.
                      </p>
                      <button
                        onClick={closeModal}
                        className="bg-custom-blue text-white py-2 px-4 rounded-lg"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )} */}
                <a
                  href="#createinvoice"
                  onClick={handleCreateInvoice}
                  className={` text-txt-blue hover:text-txt-hover`}
                >
                  Create Invoice
                </a>
                <a
                  href="/invoicelist"
                  className="text-txt-blue hover:text-txt-hover block"
                >
                  History
                </a>
                <a
                  href="/settings"
                  className="text-txt-blue hover:text-txt-hover block"
                  onClick={() => navigate("/setting")}
                >
                  Settings
                </a>
                <button className="bg-custom-blue text-white py-2 px-4 rounded-full hover:bg-blue-700 flex items-center block">
                  <img src={upgradeIcon} alt="Upgrade" className="mr-2" />
                  Upgrade
                </button>
              </nav>
              <div className="flex flex-col  space-y-2 px-4 py-4">
                {/* <button className="text-txt-blue hover:text-txt-hover block">
                  <img src={sunnyIcon} alt="Theme Toggle" />
                </button> */}
                <button
                  onClick={toggleDropdown}
                  className="border block rounded-full px-2 py-1 text-txt-blue text-sm hover:bg-custom-blue hover:text-white block text-center"
                >
                  {userName.name}
                </button>
                {isDropdownOpen && (
                  <div
                    ref={dropdownRef}
                    className="absolute right-0 mt-2 w-52 bg-white border rounded-lg shadow-lg dark:bg-bg-gray "
                  >
                    <ul>
                      <li className="px-4 mt-4 text-txt-blue cursor-pointer font-medium pl-4 dark:text-white">
                        {userName.name}
                      </li>
                      <li className="px-4 mb-4 text-txt-gray cursor-pointer text-sm pl-4 dark:text-tl-gray">
                        {userName.email}
                      </li>
                      <li
                        className="px-4 py-2 text-txt-gray hover:bg-gray-100 hover:text-black cursor-pointer pl-4  dark:text-tl-gray dark:hover:text-black dark:hover:bg-gray-600"
                        onClick={handleNavigateToMyAccount}
                      >
                        My Account
                      </li>
                      <hr />
                      <li
                        className="px-4 py-2 text-red-500 hover:bg-gray-100 cursor-pointer pl-4 dark:hover:bg-gray-600 dark:hover:font-semibold"
                        onClick={handleSignOut}
                      >
                        Sign Out
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </header>
      ) : (
        <header className="bg-white shadow-md py-4">
          <div className="container mx-auto flex flex-col md:flex-row items-center px-4">
            <div className="flex items-center justify-between w-full md:w-auto">
              <div className="flex-shrink-0">
                <Logo alt="Invoice Sheet Logo" />
              </div>

              <button
                onClick={toggleMenu}
                className="block md:hidden text-gray-900 focus:outline-none"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {isMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>

            <nav className="hidden md:flex space-x-8 ml-20">
              <a
                onClick={() => navigate("/faq")}
                className="text-gray-900 hover:underline"
              >
                Help
              </a>
              <a href="#" className="text-gray-900">
                Invoicing Guide
              </a>
              <a href="/custom" className="text-gray-900">
                Custom Template
              </a>
            </nav>

            <div className="hidden md:flex space-x-4 ml-auto">
              <a className="py-2" id="google_translate_element"></a>
              <button
                className="text-gray-900 px-6 py-2 rounded-3xl"
                onClick={() => navigate("/signup")}
              >
                Sign Up
              </button>
              <button
                className="bg-custom-blue text-white px-6 py-2 rounded-3xl hover:bg-blue-600"
                onClick={() => navigate("/login")}
              >
                Sign In
              </button>
            </div>
          </div>

          {isMenuOpen && (
            <div className="absolute top-20 left-0 w-full bg-white shadow-md z-10 md:hidden">
              <nav className="flex flex-col items-start space-y-2 px-4 py-4">
                <a href="/faq" className="text-gray-900 block">
                  Help
                </a>
                <a href="#" className="text-gray-900 block">
                  Invoicing Guide
                </a>
              </nav>
              <div className="flex flex-col items-center space-y-2 px-4 py-4">
                <button
                  className="text-gray-900 w-full px-6 py-2 rounded-3xl border border-gray-300 "
                  onClick={() => navigate("/signup")}
                >
                  Sign Up
                </button>
                <button
                  className="bg-custom-blue text-white w-full px-6 py-2 rounded-3xl hover:bg-blue-600"
                  onClick={() => navigate("/login")}
                >
                  Sign In
                </button>
              </div>
            </div>
          )}
        </header>
      )}

      <div className="bg-gradient-to-r from-green-200 via-blue-200 to-purple-200 py-11 px-4 md:px-20 lg:px-40 xl:px-80 text-justify mt-4">
        <h2 className="text-sm font-semibold text-txt-blue text-center md:text-left">
          FREE TOOLS
        </h2>
        <h1 className="text-3xl md:text-4xl font-bold text-txt-blue mt-3 text-center md:text-left">
          Free Invoice Generator
        </h1>
        <p className="text-base md:text-lg text-txt-blue mt-4 text-center md:text-left">
          Welcome to the original{" "}
          <span className="font-semibold text-txt-blue">Invoice Sheet</span>,
          trusted by millions worldwide. With our user-friendly invoice
          template, you can quickly create professional invoices directly from
          your web browser.
          <span className="font-semibold text-txt-blue">
            Easily download
          </span>{" "}
          your invoices as PDFs or send them online for seamless payment.
        </p>
        <div className="flex justify-center md:justify-start">
          <button
            className="mt-6 bg-custom-blue text-white py-2 px-4 rounded-full hover:bg-blue-600"
            onClick={handleCreateInvoice}
          >
            Create invoices
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
