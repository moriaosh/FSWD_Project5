import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

// שירותים API
import {
  getTodosByUserId,
  addTodo,
  deleteTodo,
  updateTodo
} from '../../services/todosService';

// קומפוננטות עזר
import TodoFilter from './TodoFilter';
import TodoList from './TodoList';
import Add from '../Common/Add'; // 💡 קומפוננטת ההוספה

function TodosManager() {
  const { userId } = useParams();
  const [todos, setTodos] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [sortBy, setSortBy] = useState('id');
  const [newTitle, setNewTitle] = useState(''); // 💡 ניהול שדה הקלט

  // טעינת todos לפי המשתמש מה-URL
  useEffect(() => {
    getTodosByUserId(userId)
      .then(setTodos)
      .catch((err) => console.error('Error loading todos:', err));
  }, [userId]);

  // הוספת טודו חדש
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

  // מחיקת טודו
  const handleDeleteTodo = (id) => {
    deleteTodo(id).then(() =>
      setTodos((prev) => prev.filter((todo) => todo.id !== id))
    );
  };

  // עדכון טודו
  const handleUpdateTodo = (updatedTodo) => {
    updateTodo(updatedTodo).then((data) =>
      setTodos((prev) =>
        prev.map((todo) => (todo.id === data.id ? data : todo))
      )
    );
  };

  return (
    <div>
      <h2>Todos for User {userId}</h2>

      {/* 🔍 סינון ומיון */}
      <TodoFilter
        filterText={filterText}
        onFilterChange={setFilterText}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      {/* ➕ הוספת טודו */}
      <Add
        title={newTitle}
        setTitle={setNewTitle}
        placeholder="Add new todo..."
        type="todo"
        onAdd={handleAddTodo}
      />

      {/* 📋 רשימת Todos */}
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
