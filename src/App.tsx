import React, { useState } from 'react';
import './App.css';
import LoginForm from './Login/LoginForm';
import Home from './Home/Home';
import Modal from 'react-modal';

Modal.setAppElement('#root');
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
    <div className="App bg-blue-200">
      {token ? (
        <Home onLogout={handleLogout} />
      ) : (
        <LoginForm onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
