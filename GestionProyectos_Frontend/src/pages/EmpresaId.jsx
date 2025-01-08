import React, {useEffect} from 'react'
import { useParams } from 'react-router-dom'
import useFetch from '../hooks/useFetch'    


const EmpresaId = () => {
    const { id } = useParams()  
    const { data: empresaId, fetchData, loading, error } = useFetch();

    useEffect(() => {
        const url = `http://localhost:3001/api/empresas/${id}`;
        fetchData(url);
        console.log('la empresa es:', empresaId)
    }, [id]);
  return (
    <div>EmpresaId</div>
  )
}

export default EmpresaId