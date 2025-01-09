import React from "react";
import whiteLogo from "../images/whitelogo.svg"; // Adjust the path as needed

const Footer = () => {
  return (
    <footer className="bg-gray-50 text-txt-blue py-8">
      <div className="container mx-auto px-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        {/* Column 1: Use Invoice Generator */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Use Invoice Generator</h3>
          <ul className="space-y-1">
            <li>
              <a href="#" className="hover:text-blue-600 block">
                Invoice Template
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-600 block">
                Credit Note Template
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-600 block">
                Quote Template
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-600 block">
                Purchase Order Template
              </a>
            </li>
          </ul>
        </div>

        {/* Column 2: Resources */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Resources</h3>
          <ul className="space-y-1">
            <li>
              <a href="#" className="hover:text-blue-600 block">
                Invoicing Guide
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-600 block">
                Help
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-600 block">
                Sign In
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-600 block">
                Sign Up
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-txt-blue text-sm">
            &copy; 2012-2024 INVOICE-GENERATOR.COM
          </p>
          <p className="mt-2 text-txt-gray text-sm leading-relaxed">
            Lorem ipsum dolor sit amet consectetur. At porttitor ut felis nisl
            ultrices sed sit. Cras nibh sit et diam justo in. Sollicitudin enim
            tincidunt eros mauris senectus neque.
          </p>
        </div>
      </div>

      <div className="flex justify-center items-center">
        <img src={whiteLogo} alt="Invoice Sheet Logo" className="h-16 mt-6" />
      </div>
    </footer>
  );
};

export default Footer;
