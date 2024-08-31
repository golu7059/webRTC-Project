import React, { useContext, useState } from "react";
// import { AuthContext } from "../context/AuthContext.js";
import axios from "../utils/axiosConfig.js";
import { useNavigate } from "react-router-dom";
import { Typewriter } from 'react-simple-typewriter';
import { FaUser, FaLock } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/auth/login", { email, password });
      // setUser(response.data.user);
      console.log(response);
      navigate("/chat");
    } catch (error) {
      console.log("error: ", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-900 via-blue-950 to-gray-900 p-6">
      <div className="bg-gray-700 p-8 rounded-lg shadow-2xl w-full max-w-md animate-fadeIn">
        <h2 className="text-3xl font-bold text-center mb-6 text-white bg-clip-text">
        Login to Your Account <br/> <span className="text-orange-700">Welcome </span>
          <Typewriter
            words={[' Again !',' Back !']}
            loop={true}
            cursor
            cursorStyle='_'
            typeSpeed={70}
            deleteSpeed={50}
            delaySpeed={1000}
          />
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <FaUser className="absolute left-3 top-3 text-gray-500" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="relative">
            <FaLock className="absolute left-3 top-3 text-gray-500" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="text-right">
            <a href="/forgot-password" className="text-white font-semibold hover:text-orange-700 text-sm">
              Forgot Password?
            </a>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-extrabold py-3 rounded-full hover:bg-blue-700 transition duration-300 shadow-md"
          >
            Login
          </button>
        </form>
       
        <div className="text-center mt-6">
          <p className="text-gray-200">
            Don’t have an account?{" "}
            <a href="/signup" className="text-blue-500 hover:text-orange-700">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
