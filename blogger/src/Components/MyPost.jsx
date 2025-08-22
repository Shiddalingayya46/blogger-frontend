import axios from "axios";
import { useEffect, useState } from "react";

const MyPost = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem("userId");

  const fetchMyPosts = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/post/user/${userId}`
      );
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching my posts:", error);
    } finally {
      setLoading(false);
    }
  };

  console.log(fetchMyPosts);

  useEffect(() => {
    fetchMyPosts();
  }, []);

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
    <div className="MyPosts">
      <h2>My Posts</h2>
      {posts.length === 0 ? (
        <p className="dp-no-posts">No posts available</p>
      ) : (
        posts.map((post) => (
          <div key={post._id} className="mp-post-card">
            <p className="mp-post-description">
              <strong>caption:</strong> {post.description}
            </p>
            <p className="mp-post-user">
              <strong>User ID:</strong> {post.userId}
            </p>
            {post.imageData && (
              <img
                src={getImageUrl(post.imageData)}
                alt="Post"
                className="mp-post-image"
              />
            )}

            <div>
              <p>likes: {post.likes.length}</p>
              <p>disLikes: {post.disLikes.length}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MyPost;
