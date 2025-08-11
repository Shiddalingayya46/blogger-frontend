// src/Components/Home.js
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./css/Home.css";

const Home = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const handleLogout = () => {
    localStorage.removeItem("userId");
    navigate("/login");
  };

  return (
    <nav className="home">
      <div className="nav-left">
        <h2 className="logo">My Blog</h2>
      </div>
      <div className="nav-right">
        {!userId ? (
          <Link to="/login" className="nav-btn">
            Login
          </Link>
        ) : (
          <>
            <Link to="/create" className="nav-btn">
              Create Blog
            </Link>
            <Link to="/blogs" className="nav-btn">
              All Blogs
            </Link>
            <button onClick={handleLogout} className="nav-btn">
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Home;
