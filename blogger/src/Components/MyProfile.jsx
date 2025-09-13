import React, { useEffect, useState } from "react";
import axios from "axios";
import "./css/MyProfile.css"; 

const MyProfile = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [preview, setPreview] = useState(null);
  const [profilePicBase64, setProfilePicBase64] = useState(null);

  const userId = localStorage.getItem("userId");

  const bufferToBase64 = (buffer) => {
    const bytes = new Uint8Array(buffer);
    let binary = "";
    bytes.forEach((b) => (binary += String.fromCharCode(b)));
    return window.btoa(binary);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/users/get-user/${userId}`
        );
        setUser(res.data);
        setFormData(res.data);

        if (res.data.profilePicture?.data?.data) {
          const base64 = bufferToBase64(res.data.profilePicture.data.data);
          setProfilePicBase64(
            `data:${res.data.profilePicture.contentType};base64,${base64}`
          );
        }
      } catch (err) {
        console.error(err);
      }
    };
    if (userId) fetchUser();
  }, [userId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          imageBase64: reader.result.split(",")[1],
          contentType: file.type,
        });
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { name, imageBase64, contentType } = formData; 
      await axios.put(`http://localhost:3000/api/users/update/${userId}`, {
        name,
        imageBase64,
        contentType,
      });
      alert("Profile updated successfully");
    } catch (err) {
      console.error(err);
      alert("Error updating profile");
    }
  };

  if (!user) return <p className="myprofile-loading">Loading profile...</p>;

  return (
    <div className="myprofile-container">
      <h2 className="myprofile-title">My Profile</h2>
      <form onSubmit={handleSubmit} className="myprofile-form">
        <div className="myprofile-image-section">
          <img
            src={
              preview || profilePicBase64 || "https://via.placeholder.com/150"
            }
            alt="Profile"
            className="myprofile-image"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="myprofile-file-input"
          />
        </div>

        <div className="myprofile-field">
          <label className="myprofile-label">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name || ""}
            onChange={handleChange}
            className="myprofile-input"
          />
        </div>

        <div className="myprofile-field">
          <label className="myprofile-label">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email || ""}
            readOnly
            className="myprofile-input myprofile-input-readonly"
          />
        </div>

        <button type="submit" className="myprofile-btn">
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default MyProfile;
