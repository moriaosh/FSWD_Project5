import React, { useState } from 'react';
import '../../styles/TodoItem.css';

function TodoItem({ todo, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);

  const handleCheckboxChange = () => {
    onUpdate({ ...todo, completed: !todo.completed });
  };

  const handleTitleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleTitleChange = (e) => {
    setEditedTitle(e.target.value);
  };

  const handleTitleBlur = () => {
    setIsEditing(false);
    if (editedTitle !== todo.title) {
      onUpdate({ ...todo, title: editedTitle });
    }
  };

  return (
    <li className={`todo-item ${todo.completed ? 'completed' : ''}`}>
    <span className="todo-id">{todo.id}</span>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={handleCheckboxChange}
      />

      {isEditing ? (
        <input
          className="todo-edit"
          type="text"
          value={editedTitle}
          onChange={handleTitleChange}
          onBlur={handleTitleBlur}
          autoFocus
        />
      ) : (
        <span onDoubleClick={handleTitleDoubleClick}>
          {todo.title}
        </span>
      )}

      <button onClick={() => onDelete(todo.id)} className="delete-btn">
        🗑️
      </button>
    </li>
  );
}

export default TodoItem;
