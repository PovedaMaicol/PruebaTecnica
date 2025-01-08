
import EmpresasPage from './pages/EmpresasPage'
import { Route, Routes } from 'react-router-dom'
import EmpresaId from './pages/EmpresaId'


function App() {
 

  return (
    <>
    <Routes>
    <Route path='/' element={<EmpresasPage/>}/>

    <Route path='/empresas/:id' element={<EmpresaId/>}/>

    </Routes>
  
    
    </>
  )
}

export default App
