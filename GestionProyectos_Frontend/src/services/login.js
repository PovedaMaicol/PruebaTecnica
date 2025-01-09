import axios from 'axios'
const base = import.meta.env.VITE_API_URL;
const url = '/api/login'

const login = async credentials => {
  const response = await axios.post(`${base}${url}`, credentials)
  return response.data
}

export default { login }