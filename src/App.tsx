import React from 'react';
import logo from './logo.svg';
import './App.css';
import LoginForm from './login/LoginForm';

const App: React.FC = () =>{
  return (
    <div className="App">
      <LoginForm />
    </div>
  );
}

export default App;
