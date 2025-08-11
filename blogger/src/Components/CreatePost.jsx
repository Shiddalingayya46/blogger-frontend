import { useState } from "react";
import axios from "axios";

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
      // remove the prefix "data:image/png;base64," if you want only raw base64
      const base64String = reader.result.split(",")[1];
      setImageBase64(base64String);
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userId = localStorage.getItem("userId"); // Make sure it's stored as a string
    if (!userId) {
      alert("User ID not found in local storage");
      return;
    }

    try {
      const res = await axios.post("http://localhost:3000/api/post", {
        description,
        userId,
        imageBase64,
      });
      console.log("Post created:", res.data);
      alert("Post created successfully!");
    } catch (err) {
      console.error(err);
      alert("Error creating post");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: "20px" }}>
      <h2>Create Post</h2>

      <textarea
        placeholder="Write description..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={4}
        style={{ width: "100%", marginBottom: "10px" }}
      />

      <input type="file" accept="image/*" onChange={handleImageChange} />

      <button type="submit" style={{ display: "block", marginTop: "10px" }}>
        Submit
      </button>
    </form>
  );
};

export default CreatePost;
