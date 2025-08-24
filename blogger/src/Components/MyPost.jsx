import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ import navigate hook
import "./css/MyPost.css";

const MyPost = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const userId = localStorage.getItem("userId");
  const navigate = useNavigate(); // ✅ initialize navigate

  const fetchMyPosts = async (pageNumber = 1) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:3000/api/post/user/${userId}?page=${pageNumber}&limit=2`
      );

      const { posts: newPosts, totalPages, currentPage } = response.data;
      setPosts((prev) =>
        pageNumber === 1 ? newPosts : [...prev, ...newPosts]
      );
      setHasMore(currentPage < totalPages);
      setPage(currentPage + 1);
    } catch (error) {
      console.error("Error fetching my posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyPosts(1);
  }, []);

  const handleSoftDelete = async (postId) => {
    try {
      await axios.put(`http://localhost:3000/api/post/soft-delete/${postId}`, {
        softDelete: true,
      });
      setPosts((prev) => prev.filter((p) => p._id !== postId));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

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

  return (
    <div>
      {/* Toggle buttons */}
      <div className="MyPost-toggle">
        <button className="MyPost-button active">📌 My Posts</button>
        <button
          className="MyPost-button danger"
          onClick={() => navigate("/home/deleted")} // ✅ navigate to deleted page
        >
          🗑 Deleted Posts
        </button>
      </div>

      <div className="MyPost-container">
        <h2 className="MyPost-title">My Posts</h2>

        {loading && posts.length === 0 ? (
          <p className="MyPost-message">Loading posts...</p>
        ) : posts.length === 0 ? (
          <p className="MyPost-message">No posts available</p>
        ) : (
          <div>
            {posts.map((post) => (
              <div key={post._id} className="MyPost-card">
                <p className="MyPost-caption">
                  <strong>Caption:</strong> {post.description}
                </p>

                {post.imageData && (
                  <img
                    src={getImageUrl(post.imageData)}
                    alt="Post"
                    className="MyPost-image"
                  />
                )}

                <div className="MyPost-stats">
                  <span className="MyPost-stat">
                    👍 Likes: {post.likes.length}
                  </span>
                  <span className="MyPost-stat">
                    👎 Dislikes: {post.disLikes.length}
                  </span>
                </div>

                <button
                  className="MyPost-button danger"
                  onClick={() => handleSoftDelete(post._id)}
                >
                  Delete
                </button>
              </div>
            ))}

            {hasMore && (
              <button
                className="MyPost-loadMore"
                onClick={() => fetchMyPosts(page)}
              >
                Load More
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPost;
