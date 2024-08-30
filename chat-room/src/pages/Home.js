import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Typewriter } from 'react-simple-typewriter';
import homeImage3 from '../Assets/homeImage3.png'

const Home = () => {
  const [darkMode, setDarkMode] = useState(true);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`min-h-screen flex flex-col md:flex-row items-center justify-between p-6 md:p-12 ${darkMode ? 'bg-gray-900' : 'bg-gray-300'} transition-colors duration-500`}>
      
      {/* Dark Mode Toggle */}
      <div className="absolute top-4 right-4">
        <button
          onClick={toggleDarkMode}
          className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-300 text-gray-900'} hover:shadow-lg transition-all duration-300`}
        >
          {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>

      {/* Text Section */}
      <div className={`flex-1 text-center md:text-left p-10 rounded-lg shadow-2xl flex flex-col justify-center ${darkMode ? 'text-white' : 'text-gray-900'}`} style={{ minHeight: '400px' }}>
        <h1 className={`text-4xl md:text-5xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500'}`}>
        Welcome to the Chat-Room <br/> Let<span className='text-pink-800'>'</span>s : 
          <Typewriter 
            words={[ ' Connect', ' Chat' ,' call ']}
            loop={true}
            cursor
            cursorStyle='_'
            typeSpeed={300}
            deleteSpeed={5}
            delaySpeed={1000}
          />
        </h1>
        <p className={`text-lg mb-8 animate-fadeIn delay-1s ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Experience seamless chat, video, and audio calls. Join now and start connecting with your friends!
        </p>
        <div className="space-x-4 animate-slideUp delay-2s">
          <Link to="/login">
            <button className={`px-6 py-2 rounded-full hover:shadow-md transition duration-300 ${darkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
              Login
            </button>
          </Link>
          <Link to="/signup">
            <button className={`px-6 py-2 rounded-full border-2 hover:shadow-md transition duration-300 ${darkMode ? 'border-white text-white hover:bg-white hover:text-blue-600' : 'border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'}`}>
              Sign Up
            </button>
          </Link>
        </div>
      </div>

      {/* Image Section */}
      <div className="flex-1 flex justify-center items-center mt-8 md:mt-0">
        <img
          src={homeImage3}
          alt="Chat Room"
          className="w-full max-w-xs md:max-w-md lg:max-w-lg h-auto animate-fadeIn delay-3s animate-pulse"
        />
      </div>
    </div>
  );
};

export default Home;
