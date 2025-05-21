import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Home from './Pages/Home';
import UserInfo from './Pages/UserInfo';
import NotFound from './Pages/NotFound';
import './index.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/Login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<Home />}>
        <Route path="info" element={<UserInfo />} />
        <Route index element={<p>Select an option</p>} />
      </Route>
      <Route path="/todos" element={<div>Todos Page (To be built)</div>} />
      <Route path="/posts" element={<div>Posts Page (To be built)</div>} />
      <Route path="/albums" element={<div>Albums Page (To be built)</div>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;