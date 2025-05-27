import { useContext } from 'react';
import { AuthContext } from '../Context/AuthContext';
import { Link } from 'react-router-dom';
import '../styles/UserInfo.css';

function UserInfo() {
  const { user } = useContext(AuthContext);

  return (
    <div className="userInfoContainer">
      <h2 className="userInfoTitle">User Information</h2>
      <div className="userInfoBox">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>
      </div>
      <Link to="/home" className="backHomeButton">← Back to Home</Link>
    </div>
  );
}

export default UserInfo;
