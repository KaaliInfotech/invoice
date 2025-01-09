import React, { useState } from "react";
import { signup } from "../api";
import { useNavigate } from "react-router-dom";
import LogoIcon from '../images/logo.svg';

const Signup = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    email: "",
    password: "",
    confirmpassword: "",
  });
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await signup(formData);
      if (response) {
        navigate("/verifyotp", {
          state: {
            email: formData.email,
            password: formData.password,
            action: "register"
          },
        });
      }
    } catch (err) {
      console.log(err.message || "Signup failed");
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg px-8 py-8">
        <div className="flex justify-center mb-2">
          <img src={LogoIcon} alt="logo" />
        </div>
        <p className="text-lg font-semibold text-center text-gray-700 mb-6">
          Create a free account! 👋
        </p>

        <form onSubmit={handleSignup}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">Name</label>
            <input
              type="text"
              placeholder="Please enter your name"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              onChange={(e) =>
                setFormData({ ...formData, firstname: e.target.value })
              }
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="Please enter your email"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter password"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Enter confirm password"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                onChange={(e) =>
                  setFormData({ ...formData, confirmpassword: e.target.value })
                }
                required
              />
            </div>
            {/* <a href="#" className="text-sm text-blue-500 hover:underline mt-1">
                  Forget Password?
                </a> */}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Sign In
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600 text-sm">
          Don’t have an account yet?{" "}
          <a
            href="/login"
            className="text-blue-600 font-medium hover:underline"
          >
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
