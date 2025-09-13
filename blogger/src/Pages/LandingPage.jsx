import { useNavigate } from "react-router-dom";
import "./LandingPage.css"; 

const LandingPage = () => {
  const nav = useNavigate();

  return (
    <div className="land-page">
      <h1 className="page-headline">Welcome to Blogger</h1>

      <p className="page-description">
       Developed a full-stack blogging platform using MongoDB, Express.js, React, and Node.js (MERN), enabling users to register, log in.  
      </p>

      <div className="page-buttons">
        <button
          className="landpage-login"
          onClick={() => nav("/login")}
        >
          Login
        </button>

        <button
          className="landpage-register"
          onClick={() => nav("/register")}
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default LandingPage;

