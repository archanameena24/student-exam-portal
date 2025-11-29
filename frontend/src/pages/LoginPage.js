import React, { useState } from 'react';
import API from '../services/api';

export default function LoginPage({ onLogin }) {
  const [username,setUsername] = useState('');
  const [password,setPassword] = useState('');
  async function login(e){
    e.preventDefault();
    try {
      const res = await API.post('/auth/login',{username,password});
      if(res.data.token) onLogin(res.data.token);
      else alert('Login failed');
    } catch(err){
      alert('Login failed');
    }
  }
  return (
    <div style={{padding:20}}>
      <h2>Login</h2>
      <form onSubmit={login}>
        <div><input placeholder="username" value={username} onChange={e=>setUsername(e.target.value)} /></div>
        <div><input type="password" placeholder="password" value={password} onChange={e=>setPassword(e.target.value)} /></div>
        <button>Login</button>
      </form>
    </div>
  );
}
