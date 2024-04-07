import React, { useState } from 'react';
import './App.css';
import LoginForm from './login/LoginForm';


const App: React.FC = () =>{
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  const handleLogin = (accessToken: string) => {
    setToken(accessToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <div className="App">
      {token ? (
        <div>
          <p>¡Has iniciado sesión!</p>
          <button onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      ) : (
        <LoginForm onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
