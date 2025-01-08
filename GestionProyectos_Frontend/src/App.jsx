import EmpresasPage from './pages/EmpresasPage';
import { Route, Routes } from 'react-router-dom';

import EmpresaId from './pages/EmpresaId';
import LoginPage from './pages/LoginPage';
import Navigation from './components/Navigation';

import './App.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import loginService from './services/login'; // Importa loginService correctamente

function App() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    console.log('logging in with', username, password);

    try {
      const user = await loginService.login({ username, password });

      // Almacenar el usuario y token en localStorage
      window.localStorage.setItem('loggedEmpresasAppUser', JSON.stringify(user));

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

  // Validar si hay un usuario logueado en localStorage
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedEmpresasAppUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
    }
  }, []);

  const handleLogout = () => {
    window.localStorage.clear();
    setUser(null);
    navigate('/');
  };

  return (
    <div>
      <Navigation user={user} handleLogout={handleLogout} />
      <Routes>
        <Route path='/empresas' element={<EmpresasPage />} />
        <Route
          path='/'
          element={
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
          }
        />
        <Route path='/empresas/:id' element={<EmpresaId />} />
      </Routes>
    </div>
  );
}

export default App;
