import { createContext, useState, useEffect } from 'react';
     import axios from 'axios';

     export const AuthContext = createContext();

     export function AuthProvider({ children }) {
       const [user, setUser] = useState(() => {
         const savedUser = localStorage.getItem('user');
         return savedUser ? JSON.parse(savedUser) : null;
       });
       const [userData, setUserData] = useState({ posts: [], albums: [], todos: [], comments: [], photos: [] });
       const [loading, setLoading] = useState(false);

       useEffect(() => {
         if (user) {
           fetchUserData(user.id);
         }
       }, [user]);

       const fetchUserData = async (userId) => {
         setLoading(true);
         try {
           const numericUserId = Number(userId);
           const [postsResponse, albumsResponse, todosResponse, photosResponse] = await Promise.all([
             axios.get(`http://localhost:3000/posts?userId=${numericUserId}`),
             axios.get(`http://localhost:3000/albums?userId=${numericUserId}`),
             axios.get(`http://localhost:3000/todos?userId=${numericUserId}`),
             axios.get(`http://localhost:3000/photos?userId=${numericUserId}`)
           ]);
           setUserData({
             posts: postsResponse.data,
             albums: albumsResponse.data,
             todos: todosResponse.data,
             comments: [],
             photos: photosResponse.data
           });
         } catch (err) {
           console.error('Error fetching user data:', err);
         } finally {
           setLoading(false);
         }
       };

       const fetchCommentsForPost = async (postId) => {
         try {
           const response = await axios.get(`http://localhost:3000/comments?postId=${postId}`);
           setUserData(prev => ({ ...prev, comments: response.data }));
         } catch (err) {
           console.error('Error fetching comments:', err);
         }
       };

       const login = (userData) => {
         setUser(userData);
         localStorage.setItem('user', JSON.stringify(userData));
         fetchUserData(userData.id);
       };

       const logout = () => {
         setUser(null);
         setUserData({ posts: [], albums: [], todos: [], comments: [], photos: [] });
         localStorage.removeItem('user');
       };

       return (
         <AuthContext.Provider value={{ user, userData, setUserData, loading, login, logout, fetchCommentsForPost }}>
           {children}
         </AuthContext.Provider>
       );
     }