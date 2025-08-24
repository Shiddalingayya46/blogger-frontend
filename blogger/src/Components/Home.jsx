// src/Components/Home.js
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./css/Home.css";
import CreatePost from "./CreatePost";
import DisplayPosts from "./DisplayPosts";
import MyPost from "./MyPost";
import MyProfile from "./MyProfile";
import DeletedPosts from "./DeletedPosts";

const Home = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };
  const name = localStorage.getItem("name");
  return (
    <div>
      <nav className="home-navbar">
        <div className="home-nav-left">
          <h2 className="home-logo">{name}</h2>
        </div>

        <div className="home-nav-right">
          {!userId ? (
            <Link to="/login" className="home-nav-btn">
              Login
            </Link>
          ) : (
            <div className="home-dropdown">
              {/* Dropdown toggle button */}
              <button
                className="home-nav-btn home-dropdown-toggle"
                onClick={() => setIsOpen(!isOpen)}
              >
                Menu ▾
              </button>

              {/* Dropdown menu */}
              {isOpen && (
                <div className="home-dropdown-menu">
                  <Link
                    to="/home/create"
                    className="home-dropdown-item"
                    onClick={() => setIsOpen(false)}
                  >
                    Create Blog
                  </Link>
                  <Link
                    to="/home/blogs"
                    className="home-dropdown-item"
                    onClick={() => setIsOpen(false)}
                  >
                    All Blogs
                  </Link>
                  <Link
                    to="/home/mypost"
                    className="home-dropdown-item"
                    onClick={() => setIsOpen(false)}
                  >
                    My Posts
                  </Link>
                  <Link
                    to="/home/profile"
                    className="home-dropdown-item"
                    onClick={() => setIsOpen(false)}
                  >
                    My Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="home-dropdown-item home-logout"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      <Routes>
        <Route path="create" element={<CreatePost />} />
        <Route path="blogs" element={<DisplayPosts />} />
        <Route path="mypost" element={<MyPost />} />
        <Route path="profile" element={<MyProfile />} />
        <Route path="deleted" element={<DeletedPosts />} />
      </Routes>
    </div>
  );
};

export default Home;
