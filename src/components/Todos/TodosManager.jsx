import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getTodosByUserId,
  addTodo,
  deleteTodo,
  updateTodo
} from '../../services/todosService';
import TodoFilter from './TodoFilter';
import TodoList from './TodoList';
import Add from '../Common/Add';
import '../../styles/TodosManager.css'; // ✨ נייבא את העיצוב

function TodosManager() {
  const { userId } = useParams();
  const navigate = useNavigate(); // ✅ ייבוא פונקציית ניווט
  const [todos, setTodos] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [sortBy, setSortBy] = useState('id');
  const [newTitle, setNewTitle] = useState('');

  useEffect(() => {
    getTodosByUserId(userId)
      .then(setTodos)
      .catch((err) => console.error('Error loading todos:', err));
  }, [userId]);

  const handleAddTodo = (title) => {
    const newTodo = {
      userId: Number(userId),
      title,
      completed: false
    };

    addTodo(newTodo)
      .then((data) => {
        if (!data.id || isNaN(Number(data.id))) {
          console.warn("⚠️ Invalid ID returned from server:", data.id);
        }
        setTodos((prev) => [...prev, data]);
      })
      .catch((err) => {
        console.error("❌ Failed to add todo:", err);
      });
  };

  const handleDeleteTodo = (id) => {
    deleteTodo(id).then(() =>
      setTodos((prev) => prev.filter((todo) => todo.id !== id))
    );
  };

  const handleUpdateTodo = (updatedTodo) => {
    updateTodo(updatedTodo).then((data) =>
      setTodos((prev) =>
        prev.map((todo) => (todo.id === data.id ? data : todo))
      )
    );
  };

  return (
    <div className="todosManagerContainer">
      {/* 🔙 כפתור חזור */}
      <button
        className="backButton"
        onClick={() => navigate('/home')}
      >
        ← Back to Home
      </button>

      <h2 className="todosTitle">Todos for User {userId}</h2>

      <div className="todosControls">
        <TodoFilter
          filterText={filterText}
          onFilterChange={setFilterText}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        <Add
          title={newTitle}
          setTitle={setNewTitle}
          placeholder="Add new todo..."
          type="todo"
          onAdd={handleAddTodo}
        />
      </div>

      <TodoList
        todos={todos}
        filterText={filterText}
        sortBy={sortBy}
        onDelete={handleDeleteTodo}
        onUpdate={handleUpdateTodo}
      />
    </div>
  );
}

export default TodosManager;
