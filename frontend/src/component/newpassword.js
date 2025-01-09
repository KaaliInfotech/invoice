import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { resetpassword } from "../api";
import LogoIcon from '../images/logo.svg';

const Newpassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        email,
        newPassword,
        confirmpassword,
      };
      const response = await resetpassword(payload);
      if (response && response.token) {
        console.log("New Password:", response);
        navigate("/login");
      }
    } catch (error) {
      console.log(error, "Error");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg px-8 py-8">
        <div className="flex justify-center mb-5">
          <img src={LogoIcon} alt="logo" />
        </div>
        <h2 className="text-xl font-semibold text-center text-gray-700 mb-4">
          Reset Your Password 🔐
        </h2>
        <p className="text-gray-500 text-center mb-6">
          Enter your new password below.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmpassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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

        <p className="mt-6 text-center text-gray-600 text-sm ">
          Back to 
          <a
            href="/login"
            className="text-blue-600 font-medium hover:underline ml-1"
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Newpassword;
