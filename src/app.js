import { Routes, Route, Navigate } from 'react-router-dom';
    import Login from './Pages/Login.jsx';
    import Register from './Pages/Register.jsx';
    import CompleteProfile from './Pages/CompleteProfile.jsx';
    import TodosManager from './components/Todos/TodosManager.jsx';

    import Home from './Pages/Home.jsx';
    import UserInfo from './Pages/UserInfo.jsx';
    import PostsManager from './components/PostsManager.jsx';
    import AlbumsManager from './components/AlbumsManager.jsx';
    import NotFound from './Pages/NotFound.jsx';
    import './index.css';

    function App() {
      return (
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/complete-profile" element={<CompleteProfile />} />
          <Route path="/home" element={<Home />}>
            <Route path="info" element={<UserInfo />} />
            <Route index element={<p>Select an option</p>} />
          </Route>
          <Route path="/todos" element={<TodosManager />} />
         <Route path="/users/:userId/todos" element={<TodosManager />} />
          <Route path="/posts" element={<PostsManager />} />
          <Route path="/albums" element={<AlbumsManager />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      );
    }

    export default App;