import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css'; 
import { AuthContext } from '../Context/AuthContext';
import axios from 'axios';

function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get('http://localhost:3000/users', {
        params: { username: formData.username },
      });
      const user = response.data[0];
      if (user && user.website === formData.password) {
        login(user);
        navigate('/home');
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError('Error logging in');
    }
  };

  return (
  <div className="loginContainer">
    <h2 className="loginTitle">Login</h2>
    {error && <p className="errorText">{error}</p>}

    <form onSubmit={handleSubmit} className="loginForm">
      <input
        className="loginInput"
        type="text"
        name="username"
        value={formData.username}
        onChange={handleChange}
        placeholder="Username"
        required
      />
      <input
        className="loginInput"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Password"
        required
      />
      <button type="submit" className="loginButton">Login</button>
    </form>

    <p className="registerPrompt">Don't have an account?</p>
    <button onClick={() => navigate('/register')} className="registerButton">
      Register
    </button>
  </div>
);

}

export default Login;