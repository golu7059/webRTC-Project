import React, { useState } from "react";
import axios from "../utils/axiosConfig.js";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaEnvelope, FaCamera } from "react-icons/fa"; // Import icons

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState(null); // State to hold the photo
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("photo", photo); // Append the photo to the form data

    // Debugging: Log formData contents
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
      // Send the form data to the server
      const response = await axios.post("/api/auth/signin", formData, {
        headers: {
          "Content-Type": "application/json", 
        },
      });
      navigate("/login"); // Redirect to the login page after successful registration
    } catch (error) {
      console.error("Registration error:", error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-900 via-blue-950 to-gray-900 p-6">
      <div className="bg-gray-700 p-8 rounded-lg shadow-2xl w-full max-w-md animate-fadeIn">
        <h2 className="text-3xl font-bold text-center mb-6 text-white bg-clip-text">
          Create an Account
          <br />
          <span className="text-orange-700">Join Us Now!</span>
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <FaUser className="absolute left-3 top-3 text-gray-500" />
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-10 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-3 text-gray-500" />
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
          <div className="relative">
            <FaCamera className="absolute left-3 top-3 text-gray-500" />
            <input
              type="file"
              onChange={(e) => setPhoto(e.target.files[0])}
              className="w-full pl-10 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-extrabold py-3 rounded-full hover:bg-blue-700 transition duration-300 shadow-md"
          >
            Register
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-gray-200">
            Already have an account?{" "}
            <a href="/login" className="text-blue-500 hover:text-orange-700">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
