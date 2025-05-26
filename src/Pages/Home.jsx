import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../Context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import axios from 'axios';

function Home() {
  const { user, loading, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [allPosts, setAllPosts] = useState([]);

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
          {allPosts.map(post => (
            <li key={post.id} className="postListItem">
              <div>
                <p><strong>Title:</strong> {post.title}</p>
                <p>{post.body}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="noData">No posts available.</p>
      )}
    </div>
  );
}

export default Home;
