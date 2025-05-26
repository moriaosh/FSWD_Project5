import { useContext } from 'react';
import { AuthContext } from '../Context/AuthContext';
  import { Link } from 'react-router-dom';


function UserInfo() {
  const { user } = useContext(AuthContext);
  return (
    <div>
      <h2>User Info</h2>
      <p>Name: {user.name}</p>
      <p>Username: {user.username}</p>
      <p>Email: {user.email}</p>
    </div>
  );
}

export default UserInfo;