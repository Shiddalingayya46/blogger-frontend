import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault(); // prevent page refresh

    if (!email || !password) {
      alert("All fields are required");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/api/users/login",
        {
          email,
          password,
        }
      );

      localStorage.setItem("userId", response.data.userDetails.userId);
      localStorage.setItem("email", response.data.userDetails.email);
      localStorage.setItem("name", response.data.userDetails.name);

      navigate("/home/blogs", { replace: true });
    } catch (error) {
      alert(error.response?.data?.message || "Unable to login");
      console.error("Login error", error);
    }
  };

  return (
    <div className="main-login">
      <form onSubmit={login} className="login-form">
        <h2>Login</h2>
        <input
          className="login-inputs"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email"
          required
        />
        <input
          className="login-inputs"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          required
        />
        <button className="login-button" type="submit">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
