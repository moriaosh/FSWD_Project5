import { useContext } from 'react';
import { useNavigate, Link, Outlet } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';

function Home() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user) {
    navigate('/login'); // Protect route
    return null;
  }

  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <nav>
        <button onClick={() => navigate('/home/info')}>Info</button>
        <Link to="/todos">Todos</Link>
        <Link to="/posts">Posts</Link>
        <Link to="/albums">Albums</Link>
        <button onClick={() => { logout(); navigate('/login'); }}>Logout</button>
      </nav>
      <Outlet /> {/* Render nested routes like /home/info */}
    </div>
  );
}

export default Home;