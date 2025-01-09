import React, { useState } from "react";
import { verifyOtp, verifyOtpAndresetpassword } from "../api";
import { useLocation, useNavigate } from "react-router-dom";

import LogoIcon from '../images/logo.svg';

const Verifyotp = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const location = useLocation();
  const { email, password, action } = location.state || {};
  const navigate = useNavigate();

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (/^[0-9]*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value.slice(-1);
      setOtp(newOtp);

      // if (value && index <= 7) {
      //   document.getElementById(`otp-input-${index + 1}`).focus();
      // }
    }
  };
  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text");
    if (/^[0-9]{6}$/.test(pasteData)) {
      const newOtp = pasteData.split("").slice(0, 6);
      setOtp(newOtp);
      document.getElementById(`otp-input-5`).focus();
    }
  };

  const handleOtpVerification = async () => {
    if (otp.some((digit) => digit === "")) {
      console.log("Please fill all OTP fields.");
      return; // Stop further execution if OTP is incomplete
    }

    try {
      const otpString = otp.join("");
      let response;
      if (action === "register") {
        response = await verifyOtp({ email, otp: otpString, password });
        if (response?.token) {
          navigate("/login");
        }
      } else if (action === "resetpassword") {
        response = await verifyOtpAndresetpassword({ email, otp: otpString });
        if (response?.token) {
          navigate("/newpassword", { state: { email } });
        }
      } else {
        throw new Error("Invalid action type provided.");
      }
      console.log(response);
      
      localStorage.setItem("token", response?.token);
    } catch (err) {
      console.error(
        "Error verifying OTP:",
        err.message || "Verification failed"
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg px-8 py-8">
        <div className="flex justify-center mb-2">
          <img src={LogoIcon} alt="logo" />
        </div>
        <p className="text-lg font-semibold text-center text-gray-700 mb-6">
          Enter OTP Code 🔒
        </p>

        <form className="flex justify-center gap-4 mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-input-${index}`}
              type="text"
              maxLength="1"
              value={digit}
              onPaste={handlePaste}
              onChange={(e) => handleChange(e, index)}
              className="w-12 h-12 text-center border-2 border-gray-300 rounded-md text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ))}
        </form>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition duration-200"
          onClick={handleOtpVerification()}
        >
          Verify OTP
        </button>

        <p className="mt-6 text-center text-gray-600 text-sm">
          Didn’t receive the code?
          <a href="/" className="text-blue-600 font-medium hover:underline">
            Resend OTP
          </a>
        </p>
      </div>
    </div>
  );
};

export default Verifyotp;
