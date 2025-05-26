import React from 'react';
import '../../styles/TodoFilter.css';

function TodoFilter({ filterText, onFilterChange, sortBy, onSortChange }) {
  return (
    <div className="todo-filter-container">
      <input
        type="text"
        placeholder="Search todos..."
        value={filterText}
        onChange={(e) => onFilterChange(e.target.value)}
      />

      <select value={sortBy} onChange={(e) => onSortChange(e.target.value)}>
        <option value="id">Sort by ID</option>
        <option value="title">Sort by Title</option>
        <option value="completed">Sort by Status</option>
      </select>
    </div>
  );
}

export default TodoFilter;
