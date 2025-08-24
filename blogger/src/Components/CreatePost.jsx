import { useState } from "react";
import axios from "axios";
import "./css/CreatePost.css";

const CreatePost = () => {
  const [description, setDescription] = useState("");
  const [imageBase64, setImageBase64] = useState("");

  // Convert image file to base64
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file); // converts to base64 string
    reader.onloadend = () => {
      const base64String = reader.result.split(",")[1];
      setImageBase64(base64String);
    };
  };

  const userId = localStorage.getItem("userId");
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      alert("User ID not found in local storage");
      return;
    }

    if (!description || !imageBase64) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await axios.post("http://localhost:3000/api/post", {
        description,
        userId,
        imageBase64,
      });
      alert("Post created successfully!");
      setDescription("");
      setImageBase64("");
    } catch (err) {
      console.error(err);
      alert("Error creating post");
    }
  };

  return (
    <div className="createpost-container">
      <form onSubmit={handleSubmit} className="createpost-form">
        <h2 className="createpost-heading">Create Post</h2>

        <div className="createpost-field">
          <label className="createpost-label">Caption</label>
          <textarea
            className="createpost-textarea"
            placeholder="Write a caption..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />
        </div>

        <div className="createpost-field">
          <label className="createpost-label">Upload Image</label>
          <input
            className="createpost-file"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        <button className="createpost-btn" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
