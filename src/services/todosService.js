import axios from 'axios';

const API_URL = 'http://localhost:3000/todos';

export const getTodosByUserId = async (userId) => {
  const response = await axios.get(`${API_URL}?userId=${userId}`);
  return response.data;
};

export const addTodo = async (todo) => {
    console.log("this is the is from the server", todo.id)
  const response = await axios.post(API_URL, todo);
  console.log(response.data)
  return response.data;
};

export const deleteTodo = async (id) => {
  await axios.delete(`${API_URL}/${id}`);
};

export const updateTodo = async (todo) => {
  const response = await axios.put(`${API_URL}/${todo.id}`, todo);
  return response.data;
};
