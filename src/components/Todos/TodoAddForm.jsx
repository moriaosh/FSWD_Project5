import React, { useState } from 'react';
import "../../styles/Add.css";

function TodoAddForm({ onAdd }) {
  const [newTitle, setNewTitle] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newTitle.trim() === '') return;
    onAdd(newTitle);
    setNewTitle('');
  };

  return (
    <form className="todo-add-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Add new todo..."
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
      />
      <button type="submit">Add</button>
    </form>
  );
}

export default TodoAddForm;
