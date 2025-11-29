import React, { useState } from 'react';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import { setAuthToken } from './services/api';

function App(){
  const [token, setToken] = useState(localStorage.getItem('token'));
  if (token) setAuthToken(token);
  return token ? <Dashboard onLogout={() => { localStorage.removeItem('token'); setToken(null); }} /> : <LoginPage onLogin={t => { localStorage.setItem('token', t); setAuthToken(t); setToken(t); }} />;
}

export default App;
