import axios from 'axios';
const base = import.meta.env.VITE_API_URL;
const url = '/api/users'; // Asegúrate de que coincide con la ruta del backend

const register = async (userData) => {
  const response = await axios.post(`${base}${url}`, userData);
  return response.data;
};

export default { register };
