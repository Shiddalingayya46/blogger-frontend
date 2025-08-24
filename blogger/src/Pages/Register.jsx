import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // import Link
import "./Register.css";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const register = async (e) => {
    e.preventDefault(); // prevent page refresh

    if (!name || !email || !password) {
      alert("All fields are required");
      return;
    }

    const payLoad = { name, email, password };

    try {
      const response = await axios.post(
        "http://localhost:3000/api/users",
        payLoad
      );
      if (response.status === 201) {
        alert("User registered successfully");
      } else {
        alert("Something went wrong");
      }
    } catch (error) {
      alert("Unable to reach server");
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={register} className="register-form">
        <h2 style={{ textAlign: "center" }}>Register</h2>
        <input
          className="register-card"
          type="text"
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter Name"
          required
        />
        <br />
        <input
          className="register-card"
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter Email"
          required
        />
        <br />
        <input
          className="register-card"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter Password"
          required
        />
        <br />
        <button className="btn-input" type="submit">
          Register
        </button>
        <p>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
