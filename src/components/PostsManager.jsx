import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../Context/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';

function PostsManager() {
  const { user, userData, setUserData, fetchCommentsForPost } = useContext(AuthContext);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchCriteria, setSearchCriteria] = useState({ type: 'id', value: '' });
  const [selectedPost, setSelectedPost] = useState(null);
  const [showComments, setShowComments] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', body: '' });
  const [editPost, setEditPost] = useState(null);
  const [newComment, setNewComment] = useState({ name: '', email: '', body: '' });
  const [editComment, setEditComment] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, [user.id, userData.posts]);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/posts?userId=${Number(user.id)}`
      );
      setFilteredPosts(response.data);
    } catch (err) {
      console.error('Error fetching posts:', err);
    }
  };

  const handleSearch = () => {
    const { type, value } = searchCriteria;
    if (!value) {
      fetchPosts();
      return;
    }
    const filtered = userData.posts.filter((post) => {
      if (type === 'id') {
        return post.id.toString() === value;
      }
      return post.title.toLowerCase().includes(value.toLowerCase());
    });
    setFilteredPosts(filtered);
  };

  const handleAddPost = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/posts', {
        userId: Number(user.id),
        title: newPost.title,
        body: newPost.body,
      });
      setUserData((prev) => ({
        ...prev,
        posts: [...prev.posts, response.data],
      }));
      setNewPost({ title: '', body: '' });
      fetchPosts();
    } catch (err) {
      console.error('Error adding post:', err);
    }
  };

  const handleUpdatePost = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:3000/posts/${editPost.id}`, editPost);
      setUserData((prev) => ({
        ...prev,
        posts: prev.posts.map((post) => (post.id === editPost.id ? response.data : post)),
      }));
      setEditPost(null);
      fetchPosts();
    } catch (err) {
      console.error('Error updating post:', err);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await axios.delete(`http://localhost:3000/posts/${postId}`);
      setUserData((prev) => ({
        ...prev,
        posts: prev.posts.filter((post) => post.id !== postId),
      }));
      setSelectedPost(null);
      setShowComments(false);
      fetchPosts();
    } catch (err) {
      console.error('Error deleting post:', err);
    }
  };

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
      setNewComment({ name: '', email: '', body: '' });
      fetchCommentsForPost(selectedPost.id);
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
      fetchCommentsForPost(selectedPost.id);
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
      fetchCommentsForPost(selectedPost.id);
    } catch (err) {
      console.error('Error deleting comment:', err);
    }
  };

  return (
    <div className="postsManagerContainer">
      <Link to="/home" className="navButton returnButton">Return to Home</Link>
      <h3 className="sectionTitle">Manage Your Posts</h3>

      {/* Search */}
      <div className="searchContainer">
        <label className="searchLabel">Search by: </label>
        <select
          value={searchCriteria.type}
          onChange={(e) => setSearchCriteria({ ...searchCriteria, type: e.target.value })}
          className="searchSelect"
        >
          <option value="id">ID</option>
          <option value="title">Title</option>
        </select>
        <input
          type="text"
          value={searchCriteria.value}
          onChange={(e) => setSearchCriteria({ ...searchCriteria, value: e.target.value })}
          placeholder="Search..."
          className="searchInput"
        />
        <button onClick={handleSearch} className="searchButton">Search</button>
      </div>

      {/* Post List */}
      {filteredPosts.length > 0 ? (
        <ul className="list">
          {filteredPosts.map((post) => (
            <li
              key={post.id}
              className={`postListItem ${selectedPost?.id === post.id ? 'selectedPostItem' : ''}`}
            >
              <span>ID: {post.id} | Title: {post.title}</span>
              <div>
                <button
                  onClick={() => {
                    setSelectedPost(post);
                    setShowComments(false);
                    fetchCommentsForPost(post.id);
                  }}
                  className="actionButton selectButton"
                >
                  Select
                </button>
                <button
                  onClick={() => {
                    setSelectedPost(post);
                    setEditPost(post);
                    setShowComments(false);
                    fetchCommentsForPost(post.id);
                  }}
                  className="actionButton editButton"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeletePost(post.id)}
                  className="actionButton deleteButton"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="noData">No posts available.</p>
      )}

      {/* Post Details Modal */}
      {selectedPost && (
        <div className="modalOverlay">
          <div className="modal">
            <button
              onClick={() => {
                setSelectedPost(null);
                setShowComments(false);
                setEditPost(null);
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
                    <button type="submit" className="formButton">Add Comment</button>
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
            {editPost && (
              <div className="formContainer">
                <h4 className="formTitle">Edit Post</h4>
                <form onSubmit={handleUpdatePost}>
                  <input
                    type="text"
                    value={editPost.title}
                    onChange={(e) => setEditPost({ ...editPost, title: e.target.value })}
                    placeholder="Title"
                    required
                    className="formInput"
                  />
                  <textarea
                    value={editPost.body}
                    onChange={(e) => setEditPost({ ...editPost, body: e.target.value })}
                    placeholder="Body"
                    required
                    className="formTextarea"
                  />
                  <button type="submit" className="formButton updateButton">Update Post</button>
                  <button
                    onClick={() => setEditPost(null)}
                    className="formButton cancelButton"
                  >
                    Cancel
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Post Form */}
      <div className="formContainer">
        <h4 className="formTitle">Add New Post</h4>
        <form onSubmit={handleAddPost}>
          <input
            type="text"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            placeholder="Title"
            required
            className="formInput"
          />
          <textarea
            value={newPost.body}
            onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
            placeholder="Body"
            required
            className="formTextarea"
          />
          <button type="submit" className="formButton">Add Post</button>
        </form>
      </div>
    </div>
  );
}

export default PostsManager;