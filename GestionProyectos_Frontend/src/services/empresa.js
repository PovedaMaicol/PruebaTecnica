import axios from "axios";


const base = import.meta.env.VITE_API_URL;
const url = '/api/empresas'
let token = null

const setToken = newToken => {
    token = `Bearer ${newToken}`
    console.log('token configurado', token)
}

const getAll = () => {
    const request = axios.get(`${base}${url}`)
    return request.then(response => response.data)
}

const create = async newObject => {
    const config = {
    headers: { Authorization: token },
    }
    const response = await axios.post(`${base}${url}`, newObject, config)
    return response.data
}

const update = async (id, updateEmpresa) => {
  const dire = `${base}${url}/${id}`;
  console.log('Request URL:', dire);
  console.log('updateEmpresa:', updateEmpresa);

  const config = {
    headers: { Authorization: token },
  };

  try {
    const response = await axios.put(dire, updateEmpresa, config);
    console.log('Response:', response.data);  // Verifica lo que devuelve el servidor
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error(`Error updating empresa: ${error.response.data}`);
    } else {
      console.error(`Error updating empresa: ${error.message}`);
    }
    throw error;
  }
};


  // const destroy 
  const destroy = async (id) => {

    const config = {
      headers: { Authorization: token },
    }
  
    const response = await axios.delete(`${base}${url}/${id}`, config)
    return response.data
    }

    // add history
const addHistory = async (id, historia) => {
  const config = {
    headers: {
      Authorization: token // Asegurándonos de que el token se envíe correctamente
    }
  };

  try {
    const response = await axios.post(`${base}${url}/${id}/historias`, historia, config);
    return response.data;
  } catch (error) {
    console.error('Error al agregar la historia:', error.message);
    throw error;
  }
};

const deleteHistory = async(empresaId, historiaId) => {
  try {
    const response = await axios.delete(`${base}${url}/${empresaId}/historias/${historiaId}`)
    console.log('Historia eliminada:', response);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar la historia:', error.response.data);
    return false; 
  }
}

        export default { getAll, create, update, destroy, addHistory, deleteHistory, setToken }