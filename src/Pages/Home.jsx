import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../Context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import axios from 'axios';

function Home() {
  const { user, loading, logout, fetchCommentsForPost, userData, setUserData } = useContext(AuthContext);
  const navigate = useNavigate();
  const [allPosts, setAllPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState({ name: user?.name || '', email: user?.email || '', body: '' });
  const [editComment, setEditComment] = useState(null);

  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const response = await axios.get('http://localhost:3000/posts');
        setAllPosts(response.data);
      } catch (err) {
        console.error('Error fetching posts:', err);
      }
    };
    fetchAllPosts();
  }, []);

  const handleAddComment = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/comments', {
        postId: selectedPost.id,
        name: user.name,
        email: user.email,
        body: newComment.body,
      });
      setUserData((prev) => ({
        ...prev,
        comments: [...prev.comments, response.data],
      }));
      setNewComment({ name: user.name, email: user.email, body: '' });
      fetchCommentsForPost(selectedPost.id); // Refresh comments
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  const handleUpdateComment = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:3000/comments/${editComment.id}`, editComment);
      setUserData((prev) => ({
        ...prev,
        comments: prev.comments.map((comment) =>
          comment.id === editComment.id ? response.data : comment
        ),
      }));
      setEditComment(null);
      fetchCommentsForPost(selectedPost.id); // Refresh comments
    } catch (err) {
      console.error('Error updating comment:', err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`http://localhost:3000/comments/${commentId}`);
      setUserData((prev) => ({
        ...prev,
        comments: prev.comments.filter((comment) => comment.id !== commentId),
      }));
      fetchCommentsForPost(selectedPost.id); // Refresh comments
    } catch (err) {
      console.error('Error deleting comment:', err);
    }
  };

  if (loading) {
    return <div className="loading">Loading user data...</div>;
  }

  if (!user) {
    return <div className="loginPrompt">Please log in to view your home page.</div>;
  }

  return (
    <div className="container">
      <h2 className="welcome">Welcome, {user?.name || 'User'}!</h2>
      <nav className="navigation">
        <Link to="/home/info" className="navButton">Info</Link>
        <button
          onClick={() => navigate(`/users/${user.id}/todos`)}
          className="navButton"
        >
          Todos
        </button>
        <Link to="/posts" className="navButton">Posts</Link>
        <Link to="/albums" className="navButton">Albums</Link>
        <button
          onClick={() => {
            logout();
            navigate('/login');
          }}
          className="navButton logoutButton"
        >
          Logout
        </button>
      </nav>

      <Outlet />

      <h3 className="sectionTitle">Community Posts</h3>
      {allPosts.length > 0 ? (
        <ul className="list">
          {allPosts.map((post) => (
            <li key={post.id} className="postListItem">
              <div>
                <p>
                  <strong>Title:</strong>{' '}
                  <button
                    onClick={() => {
                      setSelectedPost(post);
                      fetchCommentsForPost(post.id);
                    }}
                    className="actionButton selectButton"
                  >
                    {post.title}
                  </button>
                </p>
                <p>{post.body}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="noData">No posts available.</p>
      )}

      {selectedPost && (
        <div className="modalOverlay">
          <div className="modal">
            <button
              onClick={() => {
                setSelectedPost(null);
                setShowComments(false);
                setEditComment(null);
              }}
              className="modalCloseButton"
            >
              ×
            </button>
            <h4 className="formTitle">Post Details</h4>
            <p>
              <strong>Title:</strong> {selectedPost.title}
            </p>
            <p>
              <strong>Body:</strong> {selectedPost.body}
            </p>
            <button
              onClick={() => setShowComments(!showComments)}
              className="toggleButton"
            >
              {showComments ? 'Hide Comments' : 'Show Comments'}
            </button>
            {showComments && (
              <div>
                <h5 className="sectionTitle">Comments</h5>
                {userData.comments.length > 0 ? (
                  <ul className="list">
                    {userData.comments
                      .filter((comment) => comment.postId === selectedPost.id)
                      .map((comment) => (
                        <li key={comment.id} className="commentListItem">
                          <div>
                            <p>
                              <strong>{comment.name}</strong> ({comment.email})
                            </p>
                            <p>{comment.body}</p>
                          </div>
                          {comment.email === user.email && (
                            <div>
                              <button
                                onClick={() => setEditComment(comment)}
                                className="actionButton editButton"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteComment(comment.id)}
                                className="actionButton deleteButton"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </li>
                      ))}
                  </ul>
                ) : (
                  <p className="noData">No comments available.</p>
                )}
                <div className="formContainer">
                  <h5 className="formTitle">Add Comment</h5>
                  <form onSubmit={handleAddComment}>
                    <textarea
                      value={newComment.body}
                      onChange={(e) =>
                        setNewComment({ ...newComment, body: e.target.value })
                      }
                      placeholder="Comment"
                      required
                      className="formTextarea"
                    />
                    <button type="submit" className="formButton">
                      Add Comment
                    </button>
                  </form>
                </div>
                {editComment && (
                  <div className="formContainer">
                    <h5 className="formTitle">Edit Comment</h5>
                    <form onSubmit={handleUpdateComment}>
                      <textarea
                        value={editComment.body}
                        onChange={(e) =>
                          setEditComment({ ...editComment, body: e.target.value })
                        }
                        placeholder="Comment"
                        required
                        className="formTextarea"
                      />
                      <button type="submit" className="formButton updateButton">
                        Update Comment
                      </button>
                      <button
                        onClick={() => setEditComment(null)}
                        className="formButton cancelButton"
                      >
                        Cancel
                      </button>
                    </form>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;