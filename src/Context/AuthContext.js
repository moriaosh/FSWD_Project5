import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState({ posts: [], albums: [], todos: [], comments: [] });
  const [loading, setLoading] = useState(false);

  const fetchUserData = async (userId) => {
    setLoading(true);
    try {
      const numericUserId = Number(userId);
      const [postsResponse, albumsResponse, todosResponse] = await Promise.all([
        axios.get(`http://localhost:3000/posts?userId=${numericUserId}`),
        axios.get(`http://localhost:3000/albums?userId=${numericUserId}`),
        axios.get(`http://localhost:3000/todos?userId=${numericUserId}`)
      ]);
      setUserData({
        posts: postsResponse.data,
        albums: albumsResponse.data,
        todos: todosResponse.data,
        comments: []
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
    fetchUserData(userData.id);
  };

  const logout = () => {
    setUser(null);
    setUserData({ posts: [], albums: [], todos: [], comments: [] });
  };

  return (
    <AuthContext.Provider value={{ user, userData, setUserData, loading, login, logout, fetchCommentsForPost }}>
      {children}
    </AuthContext.Provider>
  );
}