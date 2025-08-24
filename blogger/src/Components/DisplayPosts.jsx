import { useEffect, useState } from "react";
import axios from "axios";
import "./css/DisplayPosts.css";
import { useNavigate } from "react-router-dom";

const DisplayPosts = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const userId = localStorage.getItem("userId"); // logged-in user ID

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

  // Fetch posts
  const fetchPosts = async (pageNumber) => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:3000/api/post?page=${pageNumber}&limit=2`
      );

      const { posts: newPosts, totalPages, currentPage } = response.data;

      setPosts((prev) => [...prev, ...newPosts]);
      setHasMore(currentPage < totalPages);
      setPage(currentPage + 1);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchPosts(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Like / Dislike Post
  const handleReaction = async (postId, action) => {
    try {
      const response = await axios.put(
        "http://localhost:3000/api/post/reaction",
        {
          postId,
          userId,
          action,
        }
      );

      const { likes, dislikes } = response.data;

      // Update posts locally
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? { ...post, likes, disLikes: dislikes } : post
        )
      );
    } catch (error) {
      console.error("Error reacting to post:", error);
    }
  };

  return (
    <div className="dp-posts-container">
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
      <h2 className="dp-posts-title">All Posts</h2>

      {/* No posts case (only show once, not at the end) */}
      {!loading && posts.length === 0 ? (
        <p className="dp-no-posts">No posts available</p>
      ) : (
        <>
          {posts.map((post) => (
            <div key={post._id} className="dp-post-card">
              <p className="dp-post-description">
                <strong>Caption:</strong> {post.description}
              </p>
              <p className="dp-post-user">
                <strong>Posted by:</strong>{" "}
                {post.userId?.name || "Unknown User"}
              </p>
              {post.imageData && (
                <img
                  src={getImageUrl(post.imageData)}
                  alt="Post"
                  className="dp-post-image"
                />
              )}

              <div className="dp-like-section">
                {/* LIKE button */}
                <button
                  className={`dp-like-button ${
                    post.likes.includes(userId) ? "liked" : ""
                  }`}
                  onClick={() => handleReaction(post._id, true)}
                >
                  {post.likes.includes(userId) ? "💔 Unlike" : "❤️ Like"}
                </button>
                <span className="dp-likes-count">
                  {post.likes.length} Likes
                </span>

                {/* DISLIKE button */}
                <button
                  className={`dp-dislike-button ${
                    post.disLikes?.includes(userId) ? "disliked" : ""
                  }`}
                  onClick={() => handleReaction(post._id, false)}
                >
                  {post.disLikes?.includes(userId)
                    ? "↩️ Undo Dislike"
                    : "👎 Dislike"}
                </button>
                <span className="dp-dislikes-count">
                  {post.disLikes?.length || 0} Dislikes
                </span>
              </div>
            </div>
          ))}

          {/* Load More button */}
          {hasMore && !loading && (
            <button
              onClick={() => fetchPosts(page)}
              className="dp-load-more-button"
            >
              Load More
            </button>
          )}

          {/* Loading indicator */}
          {loading && <p className="dp-loading">Loading more posts...</p>}

          {/* End of posts (only show if posts exist) */}
          {!hasMore && posts.length > 0 && (
            <p className="dp-no-posts">No more posts</p>
          )}
        </>
      )}
    </div>
  );
};

export default DisplayPosts;
