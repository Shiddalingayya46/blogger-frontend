import React, { useEffect, useState } from "react";
import axios from "axios";
import "./css/DisplayPosts.css";
import { useNavigate } from "react-router-dom";

const DisplayPosts = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem("userId"); // Get logged-in user ID

  // Fetch posts
  const fetchPosts = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/post");
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Like / Dislike Post
  const handleLike = async (postId) => {
    try {
      const response = await axios.post("http://localhost:3000/api/post/like", {
        postId,
        userId,
      });

      // Update posts locally
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? { ...post, likes: response.data.likes } : post
        )
      );
    } catch (error) {
      console.error("Error liking/disliking post:", error);
    }
  };

  // Convert MongoDB Buffer to base64 URL
  const getImageUrl = (imageData) => {
    if (!imageData || !imageData.data) return null;
    const base64String = btoa(
      new Uint8Array(imageData.data.data).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        ""
      )
    );
    return `data:${imageData.contentType};base64,${base64String}`;
  };

  if (loading) return <p className="loading">Loading posts...</p>;

  return (
    <div className="posts-container">
      <button
        onClick={() => navigate("/create")}
        style={{
          border: "none",
          borderRadius: "10px",
          padding: "10px",
          cursor: "pointer",
        }}
      >
        Add Blog +
      </button>
      <h2 className="posts-title">All Posts</h2>
      {posts.length === 0 ? (
        <p className="no-posts">No posts available</p>
      ) : (
        posts.map((post) => (
          <div key={post._id} className="post-card">
            <p className="post-description">
              <strong>Description:</strong> {post.description}
            </p>
            <p className="post-user">
              <strong>User ID:</strong> {post.userId}
            </p>
            {post.imageData && (
              <img
                src={getImageUrl(post.imageData)}
                alt="Post"
                className="post-image"
              />
            )}

            <div className="like-section">
              <button
                className={`like-button ${
                  post.likes.includes(userId) ? "liked" : ""
                }`}
                onClick={() => handleLike(post._id)}
              >
                {post.likes.includes(userId) ? "💔 Dislike" : "❤️ Like"}
              </button>
              <span className="likes-count">{post.likes.length} Likes</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default DisplayPosts;
