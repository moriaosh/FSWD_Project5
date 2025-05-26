import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

// שירותים מופרדים
import {
  getTodosByUserId,
  addTodo,
  deleteTodo,
  updateTodo
} from '../../services/todosService';

// קומפוננטות עזר
import TodoFilter from './TodoFilter';
import TodoList from './TodoList';
import TodoAddForm from './TodoAddForm';

function TodosManager() {
  const { userId } = useParams(); // שליפת userId מה-URL
  const [todos, setTodos] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [sortBy, setSortBy] = useState('id');

  // טעינת todos מהשרת
  useEffect(() => {
    getTodosByUserId(userId)
      .then(setTodos)
      .catch((err) => console.error('Error loading todos:', err));
  }, [userId]);

  // הוספת משימה חדשה
  const handleAddTodo = (title) => {
    const newTodo = {
      userId: Number(userId),
      title,
      completed: false
    };
    addTodo(newTodo).then((data) => setTodos([...todos, data]));
  };

  // מחיקת משימה
  const handleDeleteTodo = (id) => {
    deleteTodo(id).then(() =>
      setTodos(todos.filter((todo) => todo.id !== id))
    );
  };

  // עדכון משימה (כותרת / מצב ביצוע)
  const handleUpdateTodo = (updatedTodo) => {
    updateTodo(updatedTodo).then((data) =>
      setTodos(todos.map((todo) => (todo.id === data.id ? data : todo)))
    );
  };

  return (
    <div>
      <h2>Todos for User {userId}</h2>

      {/* סינון ומיון */}
      <TodoFilter
        filterText={filterText}
        onFilterChange={setFilterText}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      {/* טופס הוספה */}
      <TodoAddForm onAdd={handleAddTodo} />

      {/* רשימת todos */}
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
