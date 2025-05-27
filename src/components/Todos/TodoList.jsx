import React from 'react';
import '../../styles/TodoList.css';
import TodoItem from './TodoItem';

function TodoList({ todos, filterText, sortBy, onDelete, onUpdate }) {
  // סינון לפי טקסט
  const filteredTodos = todos.filter(todo => {
    const lower = filterText.toLowerCase();
    return (
      todo.title.toLowerCase().includes(lower) ||
      String(todo.id).includes(lower) ||
      String(todo.completed).includes(lower)
    );
  });

  // מיון לפי sortBy
  const sortedTodos = [...filteredTodos].sort((a, b) => {
    if (sortBy === 'id') return a.id - b.id;
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    if (sortBy === 'completed') return Number(a.completed) - Number(b.completed);
    return 0;
  });

  return (
    <ul>
      {sortedTodos.map(todo => (
        
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}
    </ul>
  );
}

export default TodoList;
