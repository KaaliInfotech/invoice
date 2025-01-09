import React, { useEffect, useState } from "react";
import { login, signinWithGoogle } from "../api";
import LogoIcon from "../images/logo.svg";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login({ email, password });
      navigate("/");
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    /* global google */
    if (window.google) {
      google.accounts.id.initialize({
        client_id:
          "924447685202-6soo79bh1qei5r4qgmbuhm5ai7m5tmbf.apps.googleusercontent.com", // Replace with your client ID
        callback: handleCredentialResponse,
      });

      google.accounts.id.renderButton(
        document.getElementById("google-signin-button"),
        {
          theme: "outline", // or "filled_black"
          size: "large", // small, medium, or large
        }
      );

      google.accounts.id.prompt(); // Show the one-tap prompt
    }
  }, []);

  const handleCredentialResponse = async (response) => {
    console.log("Encoded JWT ID token: " + response.credential);
    const userObject = jwtDecode(response.credential);
    console.log("User Info:", userObject);
    try {
      const data = await signinWithGoogle(response.credential);
      console.log("Backend response:", data);

      if (data.token) {
        localStorage.setItem("token", data.token);
        navigate("/");
      }
    } catch (err) {
      console.error("Google Sign-In API error:", err.response?.data || err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg px-8 py-8">
        <div className="flex justify-center mb-2">
          <img src={LogoIcon} alt="logo" />
        </div>
        <p className="text-lg font-semibold text-center text-gray-700 mb-6">
          Welcome back! 👋
        </p>

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="Please enter your email"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <a
              href="/resetpassword"
              className="text-sm text-blue-500 hover:underline mt-1"
            >
              reset Password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Sign In
          </button>
        </form>

        <div className="mt-4">
          <div id="google-signin-button"></div>
        </div>

        <p className="mt-6 text-center text-gray-600 text-sm">
          Don’t have an account yet?
          <a
            href="/signup"
            className="text-blue-600 font-medium hover:underline"
          >
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
