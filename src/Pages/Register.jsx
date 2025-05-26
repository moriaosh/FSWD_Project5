import { useState } from 'react';
   import { useNavigate } from 'react-router-dom';
   import axios from 'axios';

   function Register() {
     const [formData, setFormData] = useState({ username: '', password: '', passwordVerify: '', email: '', name: '' });
     const [error, setError] = useState('');
     const navigate = useNavigate();

     const handleChange = (e) => {
       setFormData({ ...formData, [e.target.name]: e.target.value });
     };

     const handleSubmit = async (e) => {
       e.preventDefault();
       if (formData.password !== formData.passwordVerify) {
         setError('Passwords do not match');
         return;
       }
       try {
         // Check if username exists
         const userCheck = await axios.get(`http://localhost:3000/users?username=${formData.username}`);
         if (userCheck.data.length > 0) {
           setError('Username already exists');
           return;
         }
         navigate('/complete-profile', { state: { username: formData.username, password: formData.password } });
       } catch (err) {
         setError('Error checking username');
       }
     };

     return (
       <div>
         <h2>Register</h2>
         {error && <p style={{ color: 'red' }}>{error}</p>}
         <form onSubmit={handleSubmit}>
           <input
             type="text"
             name="username"
             value={formData.username}
             onChange={handleChange}
             placeholder="Username"
             required
           />
           <input
             type="password"
             name="password"
             value={formData.password}
             onChange={handleChange}
             placeholder="Password"
             required
           />
           <input
             type="password"
             name="passwordVerify"
             value={formData.passwordVerify}
             onChange={handleChange}
             placeholder="Verify Password"
             required
           />
           <button type="submit">Next</button>
         </form>
       </div>
     );
   }

   export default Register;