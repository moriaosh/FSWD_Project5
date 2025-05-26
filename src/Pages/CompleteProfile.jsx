import { useState } from 'react';
   import { useNavigate, useLocation } from 'react-router-dom';
   import axios from 'axios';

   function CompleteProfile() {
     const [formData, setFormData] = useState({ email: '', name: '' });
     const [error, setError] = useState('');
     const navigate = useNavigate();
     const location = useLocation();
     const { username, password } = location.state || {};

     const handleChange = (e) => {
       setFormData({ ...formData, [e.target.name]: e.target.value });
     };

     const handleSubmit = async (e) => {
       e.preventDefault();
       try {
         await axios.post('http://localhost:3000/users', {
           username,
           website: password,
           email: formData.email,
           name: formData.name,
         });
         navigate('/login');
       } catch (err) {
         setError('Error completing registration');
       }
     };

     if (!username || !password) {
       return <div>Please start registration from the beginning.</div>;
     }

     return (
       <div>
         <h2>Complete Your Profile</h2>
         {error && <p style={{ color: 'red' }}>{error}</p>}
         <form onSubmit={handleSubmit}>
           <input
             type="email"
             name="email"
             value={formData.email}
             onChange={handleChange}
             placeholder="Email"
             required
           />
           <input
             type="text"
             name="name"
             value={formData.name}
             onChange={handleChange}
             placeholder="Name"
             required
           />
           <button type="submit">Complete Registration</button>
         </form>
       </div>
     );
   }

   export default CompleteProfile;