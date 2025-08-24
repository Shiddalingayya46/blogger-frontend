import axios from "axios";
import { useEffect, useState } from "react";
import "./css/DeletedPosts.css";

const DeletedPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const userId = localStorage.getItem("userId");

  const fetchDeletedPosts = async (pageNumber = 1) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:3000/api/post/user/${userId}/deleted?page=${pageNumber}&limit=2`
      );
      const { posts: newPosts, totalPages, currentPage } = response.data;
      setPosts((prev) =>
        pageNumber === 1 ? newPosts : [...prev, ...newPosts]
      );
      setHasMore(currentPage < totalPages);
      setPage(currentPage + 1);
    } catch (error) {
      console.error("Error fetching deleted posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeletedPosts(1);
  }, []);

  // Restore post from bin
  const handleRestore = async (postId) => {
    try {
      await axios.put(
        `http://localhost:3000/api/post/soft-delete/${postId}`,
        { softDelete: false } // ✅ send false to restore
      );
      setPosts((prev) => prev.filter((p) => p._id !== postId));
    } catch (error) {
      console.error("Error restoring post:", error);
    }
  };

  // Permanently delete post
  const handlePermanentDelete = async (postId) => {
    try {
      await axios.delete(
        `http://localhost:3000/api/post/permanent-delete/${postId}`
      );
      setPosts((prev) => prev.filter((p) => p._id !== postId));
    } catch (error) {
      console.error("Error permanently deleting post:", error);
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
    <div className="DeletedPosts">
      <h2 className="DeletedPosts-title">Deleted Posts</h2>
      {loading && posts.length === 0 ? (
        <p className="DeletedPosts-message">Loading deleted posts...</p>
      ) : posts.length === 0 ? (
        <p className="DeletedPosts-message">No deleted posts</p>
      ) : (
        <div>
          {posts.map((post) => (
            <div key={post._id} className="DeletedPosts-card">
              <p className="DeletedPosts-caption">
                <strong>Caption:</strong> {post.description}
              </p>
              {post.imageData && (
                <img
                  src={getImageUrl(post.imageData)}
                  alt="Deleted Post"
                  className="DeletedPosts-image"
                />
              )}
              <div className="DeletedPosts-actions">
                <button
                  className="DeletedPosts-button restore"
                  onClick={() => handleRestore(post._id)}
                >
                  ♻️ Restore
                </button>
                <button
                  className="DeletedPosts-button danger"
                  onClick={() => handlePermanentDelete(post._id)}
                >
                  ❌ Permanently Delete
                </button>
              </div>
            </div>
          ))}
          {hasMore && (
            <button
              className="DeletedPosts-loadMore"
              onClick={() => fetchDeletedPosts(page)}
            >
              Load More
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default DeletedPosts;
