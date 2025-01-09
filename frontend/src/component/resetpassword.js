import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { resetpasswordReq } from "../api";
import LogoIcon from '../images/logo.svg';

const Resetpassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      console.log("Sending reset password request for email:", email);
      const otprequest = await resetpasswordReq({email:email});
      if (otprequest) {
        navigate("/verifyotp", {
          state: {
            email: email,
            action: "resetpassword"
          },
        });
      }
    } catch (error) {
      console.error("Error sending reset password email: ", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg px-8 py-8">
        <div className="flex justify-center mb-5">
          <img src={LogoIcon} alt="logo" />
        </div>
        <p className="text-lg font-semibold text-center text-gray-700 mb-6">
          Reset your password🔐
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Reset Password
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600 text-sm">
          Remember your password?
          <a
            href="/login"
            className="text-blue-600 font-medium hover:underline"
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Resetpassword;
