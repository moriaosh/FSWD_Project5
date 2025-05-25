import { useContext, useState } from 'react';
import { AuthContext } from '../Context/AuthContext';
import PostsManager from '../components/PostsManager';

function Home() {
  const { user, userData, loading } = useContext(AuthContext);
  const [showPosts, setShowPosts] = useState(false);
  const [showAlbums, setShowAlbums] = useState(false);
  const [showTodos, setShowTodos] = useState(false);

  if (loading) {
    return <div className="loading">Loading user data...</div>;
  }

  if (!user) {
    return <div className="loginPrompt">Please log in to view your home page.</div>;
  }

  return (
    <div className="container">
      <h2 className="welcome">
        Welcome, {user?.name || 'User'}!
      </h2>

      {/* Your Posts Section */}
      <div className="section">
        <button
          onClick={() => setShowPosts(!showPosts)}
          className="toggleButton"
        >
          {showPosts ? 'Hide Posts' : 'Show Posts'}
        </button>
        {showPosts && (
          <div>
            {userData.posts.length > 0 ? (
              <ul className="list">
                {userData.posts.map(post => (
                  <li key={post.id} className="listItem">
                    <strong>{post.title}</strong>: {post.body}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="noData">No posts available.</p>
            )}
          </div>
        )}
      </div>

      {/* Your Albums Section */}
      <div className="section">
        <button
          onClick={() => setShowAlbums(!showAlbums)}
          className="toggleButton"
        >
          {showAlbums ? 'Hide Albums' : 'Show Albums'}
        </button>
        {showAlbums && (
          <div>
            {userData.albums.length > 0 ? (
              <ul className="list">
                {userData.albums.map(album => (
                  <li key={album.id} className="listItem">
                    {album.title}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="noData">No albums available.</p>
            )}
          </div>
        )}
      </div>

      {/* Your Todos Section */}
      <div className="section">
        <button
          onClick={() => setShowTodos(!showTodos)}
          className="toggleButton"
        >
          {showTodos ? 'Hide Todos' : 'Show Todos'}
        </button>
        {showTodos && (
          <div>
            {userData.todos.length > 0 ? (
              <ul className="list">
                {userData.todos.map(todo => (
                  <li key={todo.id} className="listItem">
                    {todo.title} - {todo.completed ? 'Completed' : 'Pending'}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="noData">No todos available.</p>
            )}
          </div>
        )}
      </div>

      {/* Part E: Posts Management */}
      <PostsManager />
    </div>
  );
}

export default Home;