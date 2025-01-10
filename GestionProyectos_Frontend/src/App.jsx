import EmpresasPage from './pages/EmpresasPage';
import { Route, Routes } from 'react-router-dom';

import EmpresaId from './pages/EmpresaId';
import LoginPage from './pages/LoginPage';
import Navigation from './components/Navigation';

import './App.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import loginService from './services/login'; // Importa loginService correctamente
import empresaService from './services/empresa';
import RegistrationForm from './pages/RegistrationForm';

function App() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // Validar si hay un usuario logueado en localStorage
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedEmpresasAppUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      empresaService.setToken(user.token);
    }
  }, []);

  // Monitorear cambios en 'user'
  useEffect(() => {
    console.log('Current user:', user);
  }, [user]);

  const handleLogin = async (event) => {
    event.preventDefault();
    console.log('logging in with', username);

    try {
      const user = await loginService.login({ username, password });

      // Almacenar el usuario y token en localStorage
      window.localStorage.setItem('loggedEmpresasAppUser', JSON.stringify(user));

      empresaService.setToken(user.token);
      // Actualizar el estado global del usuario
      setUser(user);

      // Limpiar los campos
      setUsername('');
      setPassword('');

      // Redirigir al usuario a la página de empresas
      navigate('/empresas');
    } catch (exception) {
      setErrorMessage('Wrong credentials');
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const handleLogout = () => {
    window.localStorage.clear();
    setUser(null);
    navigate('/');
  };

  return (
    <div>
      {/* Solo mostrar el Navigation si el usuario está logueado */}
      {user && <Navigation user={user} handleLogout={handleLogout} />}
      
      <Routes>
        <Route path='/empresas' element={<EmpresasPage user={user} handleLogout={handleLogout}/>} />
        
        {/* Solo mostrar el LoginPage si el usuario no está logueado */}
        <Route
          path='/'
          element={
            !user && (
              <LoginPage
                setUser={setUser}
                handleLogin={handleLogin}
                username={username}
                password={password}
                setUsername={setUsername}
                setPassword={setPassword}
                setErrorMessage={setErrorMessage} // Asegúrate de pasar esto
                errorMessage={errorMessage}
              />
            )
          }
        />


        
        <Route path='/users' element={<RegistrationForm/>}/>
        
        <Route path='/empresas/:id' element={<EmpresaId />} />
      </Routes>
    </div>
  );
}

export default App;
