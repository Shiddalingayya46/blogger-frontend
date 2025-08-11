import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import LandingPage from "./Pages/LandingPage";
import CreatePost from "./Components/CreatePost";
import DisplayPosts from "./Components/DisplayPosts";
import Home from "./Components/Home";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<Home />} />
      <Route path="/create" element={<CreatePost />} />
      <Route path="/blogs" element={<DisplayPosts />} />
    </Routes>
  );
}

export default App;
