import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const nav = useNavigate();
  return (
    <div
      style={{
        backgroundColor:"skyblue",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h1>Welcome to Blogger</h1>
      <div
        style={{
          display: "flex",
          gap: "10px",
        }}
      >
        <button
          style={{
            border: "none",
            borderRadius: "10px",
            padding: "10px",
            cursor: "pointer",
         }}
          onClick={() => nav("/login")}
        >
         Login
        </button>

        <button
          style={{
            border: "none",
            borderRadius: "10px",
            padding: "10px",
            cursor: "pointer",
          }}
          onClick={() => nav("/register")}
        >
          Register
        </button>

      </div>
    </div>
  );
};

export default LandingPage;
