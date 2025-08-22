import { useState } from "react";
import axios from "axios";
import "./Register.css";

const Register = () => {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const register = async (e) => {
    if (!name || !email || !password) {
      alert("please all fields required");
      return;
    }
    const payLoad = { name: name, email: email, password: password };

    try {
      const response = await axios.post(
        "http://localhost:3000/api/users",
        payLoad
      );
      console.log("response", response);
      if (response.status === 201) {
        alert("user register succesfully");
      } else {
        alert("something went wrong");
      }
    } catch (error) {
      alert("un able to server");
    }
  };
  return (
    <div className="register-container">
      <form onSubmit={register} className="register-form">
        <h2 style={{ textAlign: "center", alignItems: "center" }}>Register</h2>
        <input
          className="register-card"
          type="name"
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter Name"
        />
        <br />
        <input
          className="register-card"
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter Email"
        />
        <br />
        <input
          className="register-card"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
        />
        <br />
        <button
          className="btn-input"
          type="submit">
          Register
        </button>
      </form>
    </div>
  );
};
export default Register;


