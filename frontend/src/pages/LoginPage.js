// src/pages/LoginPage.js
import React, { useState } from 'react';
import { authAPI, setAuthToken } from '../services/api';

export default function LoginPage({ onLogin, onRegisterClick }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleLogin(e) {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await authAPI.login({ username, password });

            // Check for error in response
            if (response.data.error) {
                if (response.data.error === 'invalid_credentials') {
                    setError('Invalid username or password');
                } else {
                    setError('Login failed: ' + response.data.error);
                }
                return;
            }

            // Check for token in response
            if (response.data.token) {
                // Store token and username
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('username', response.data.username);
                // Set token in axios headers
                setAuthToken(response.data.token);
                // Call onLogin callback
                onLogin(response.data);
            } else {
                setError('Login failed - Invalid response from server');
            }
        } catch (err) {
            if (err.response?.status === 401) {
                setError('Invalid username or password');
            } else if (err.response?.data?.error) {
                setError(err.response.data.error);
            } else {
                setError('Login failed - Please try again');
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={containerStyle}>
            <h2>Login</h2>
            {error && <div style={errorStyle}>{error}</div>}

            <form onSubmit={handleLogin}>
                <div style={formGroupStyle}>
                    <label htmlFor="username">Username</label>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        disabled={loading}
                        style={inputStyle}
                    />
                </div>

                <div style={formGroupStyle}>
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={loading}
                        style={inputStyle}
                    />
                </div>

                <div style={buttonContainerStyle}>
                    <button
                        type="submit"
                        disabled={loading || !username || !password}
                        style={submitButtonStyle}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                    <button
                        type="button"
                        onClick={onRegisterClick}
                        disabled={loading}
                        style={registerButtonStyle}
                    >
                        Register
                    </button>
                </div>
            </form>
        </div>
    );
}

// Styles
const containerStyle = {
    maxWidth: '400px',
    margin: '40px auto',
    padding: '20px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
};

const formGroupStyle = {
    marginBottom: '15px'
};

const inputStyle = {
    width: '100%',
    padding: '8px',
    marginTop: '5px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '16px'
};

const errorStyle = {
    color: '#dc3545',
    padding: '10px',
    marginBottom: '15px',
    backgroundColor: '#f8d7da',
    borderRadius: '4px',
    border: '1px solid #dc3545'
};

const buttonContainerStyle = {
    display: 'flex',
    gap: '10px',
    marginTop: '20px'
};

const submitButtonStyle = {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    flex: '1',
    fontSize: '16px'
};

const registerButtonStyle = {
    padding: '10px 20px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    flex: '1',
    fontSize: '16px'
};
