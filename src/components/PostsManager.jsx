import { useContext, useState } from 'react';
import { AuthContext } from '../Context/AuthContext';
import axios from 'axios';

function PostsManager() {
  const { user, userData, fetchCommentsForPost } = useContext(AuthContext);
  const [showPosts, setShowPosts] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState({ type: 'id', value: '' });
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [newPost, setNewPost] = useState({ title: '', body: '' });
  const [editPost, setEditPost] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [editComment, setEditComment] = useState(null);
  const [showComments, setShowComments] = useState(false); // New state for toggling comments

  // Handle search
  const handleSearch = () => {
    const { type, value } = searchCriteria;
    if (!value) {
      setFilteredPosts(userData.posts);
      return;
    }
    const filtered = userData.posts.filter(post => {
      if (type === 'id') {
        return post.id.toString() === value;
      } else {
        return post.title.toLowerCase().includes(value.toLowerCase());
      }
    });
    setFilteredPosts(filtered);
  };

  // Handle post creation
  const handleAddPost = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/posts', {
        userId: Number(user.id),
        title: newPost.title,
        body: newPost.body
      });
      setUserData(prev => ({
        ...prev,
        posts: [...prev.posts, response.data]
      }));
      setFilteredPosts(prev => [...prev, response.data]);
      setNewPost({ title: '', body: '' });
    } catch (err) {
      console.error('Error adding post:', err);
    }
  };

  // Handle post update
  const handleUpdatePost = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:3001/posts/${editPost.id}`, editPost);
      setUserData(prev => ({
        ...prev,
        posts: prev.posts.map(post => (post.id === editPost.id ? response.data : post))
      }));
      setFilteredPosts(prev => prev.map(post => (post.id === editPost.id ? response.data : post)));
      setEditPost(null);
    } catch (err) {
      console.error('Error updating post:', err);
    }
  };

  // Handle post deletion
  const handleDeletePost = async (postId) => {
    try {
      await axios.delete(`http://localhost:3001/posts/${postId}`);
      setUserData(prev => ({
        ...prev,
        posts: prev.posts.filter(post => post.id !== postId)
      }));
      setFilteredPosts(prev => prev.filter(post => post.id !== postId));
      if (selectedPost?.id === postId) {
        setSelectedPost(null);
        setUserData(prev => ({ ...prev, comments: [] }));
        setShowComments(false); // Hide comments if the selected post is deleted
      }
    } catch (err) {
      console.error('Error deleting post:', err);
    }
  };

  // Handle post selection
  const handleSelectPost = (post) => {
    setSelectedPost(post);
    setShowComments(false); // Reset comments visibility when selecting a new post
  };

  // Handle comment creation
  const handleAddComment = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/comments', {
        postId: selectedPost.id,
        userId: user.id,
        body: newComment
      });
      setUserData(prev => ({
        ...prev,
        comments: [...prev.comments, response.data]
      }));
      setNewComment('');
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  // Handle comment update
  const handleUpdateComment = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:3001/comments/${editComment.id}`, editComment);
      setUserData(prev => ({
        ...prev,
        comments: prev.comments.map(comment => (comment.id === editComment.id ? response.data : comment))
      }));
      setEditComment(null);
    } catch (err) {
      console.error('Error updating comment:', err);
    }
  };

  // Handle comment deletion
  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`http://localhost:3001/comments/${commentId}`);
      setUserData(prev => ({
        ...prev,
        comments: prev.comments.filter(comment => comment.id !== commentId)
      }));
    } catch (err) {
      console.error('Error deleting comment:', err);
    }
  };

  return (
    <div className="postsManagerContainer">
      <button
        onClick={() => {
          setShowPosts(true);
          setFilteredPosts(userData.posts);
        }}
        className="toggleButton"
      >
        Manage Posts
      </button>

      {showPosts && (
        <div>
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
            <button onClick={handleSearch} className="searchButton">
              Search
            </button>
          </div>

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
              <button type="submit" className="formButton">
                Add Post
              </button>
            </form>
          </div>

          {/* Post List */}
          {filteredPosts.length > 0 ? (
            <ul className="list">
              {filteredPosts.map(post => (
                <li
                  key={post.id}
                  className={`postListItem ${selectedPost?.id === post.id ? 'selectedPostItem' : ''}`}
                >
                  <span>ID: {post.id} | Title: {post.title}</span>
                  <div>
                    <button
                      onClick={() => handleSelectPost(post)}
                      className="actionButton selectButton"
                    >
                      Select
                    </button>
                    <button
                      onClick={() => setEditPost(post)}
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

          {/* Edit Post Form */}
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
                <button type="submit" className="formButton updateButton">
                  Update Post
                </button>
                <button
                  onClick={() => setEditPost(null)}
                  className="formButton cancelButton"
                >
                  Cancel
                </button>
              </form>
            </div>
          )}

          {/* Selected Post Details */}
          {selectedPost && (
            <div className="formContainer">
              <h4 className="formTitle">Selected Post</h4>
              <p><strong>Title:</strong> {selectedPost.title}</p>
              <p><strong>Body:</strong> {selectedPost.body}</p>

              {/* Comments Section */}
              <button
                onClick={() => {
                  if (!showComments) {
                    fetchCommentsForPost(selectedPost.id); // Fetch comments only if not already visible
                  }
                  setShowComments(!showComments); // Toggle visibility
                }}
                className="actionButton selectButton"
              >
                {showComments ? 'Hide Comments' : 'Show Comments'}
              </button>
              {showComments && userData.comments.length > 0 && (
                <div>
                  <h5 className="sectionTitle">Comments</h5>
                  <ul className="list">
                    {userData.comments.map(comment => (
                      <li key={comment.id} className="commentListItem">
                        <p>{comment.body} (by User ID: {comment.userId})</p>
                        {comment.userId === user?.id.toString() && (
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
                </div>
              )}

              {/* Add Comment Form */}
              <div>
                <h5 className="sectionTitle">Add Comment</h5>
                <form onSubmit={handleAddComment}>
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    required
                    className="formTextarea"
                    style={{ minHeight: '60px' }}
                  />
                  <button type="submit" className="formButton">
                    Add Comment
                  </button>
                </form>
              </div>

              {/* Edit Comment Form */}
              {editComment && (
                <div>
                  <h5 className="sectionTitle">Edit Comment</h5>
                  <form onSubmit={handleUpdateComment}>
                    <textarea
                      value={editComment.body}
                      onChange={(e) => setEditComment({ ...editComment, body: e.target.value })}
                      required
                      className="formTextarea"
                      style={{ minHeight: '60px' }}
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
      )}
    </div>
  );
}

export default PostsManager;