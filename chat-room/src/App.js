import React,{lazy} from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
const Home = lazy(()=>import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Register'));
// import './index.css';  // Import global styles

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;