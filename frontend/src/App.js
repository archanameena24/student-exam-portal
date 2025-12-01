// src/App.js
import React, { useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import Registration from './pages/Registration';
import { setAuthToken } from './services/api';

function App() {
    // Initialize states
    const [token, setToken] = useState(null);
    const [isRegistering, setIsRegistering] = useState(false);
    const [username, setUsername] = useState(null);
    const [loading, setLoading] = useState(true);

    // Initialize auth state from localStorage on component mount
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUsername = localStorage.getItem('username');

        if (storedToken) {
            setAuthToken(storedToken);
            setToken(storedToken);
            setUsername(storedUsername);
        }

        setLoading(false);
    }, []);

    // Handle login
    const handleLogin = (data) => {
        if (data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', data.username);
            setAuthToken(data.token);
            setToken(data.token);
            setUsername(data.username);
            setIsRegistering(false);
        }
    };

    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        setAuthToken(null);
        setToken(null);
        setUsername(null);
    };

    // Handle switching to registration
    const handleRegisterClick = () => {
        setIsRegistering(true);
    };

    // Handle switching back to login
    const handleBackToLogin = () => {
        setIsRegistering(false);
    };

    // Styles
    const appStyle = {
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        display: 'flex',
        flexDirection: 'column'
    };

    const contentStyle = {
        flex: 1,
        padding: '20px'
    };

    const loadingStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh'
    };

    // Show loading state
    if (loading) {
        return (
            <div style={loadingStyle}>
                Loading...
            </div>
        );
    }

    // Main render logic
    return (
        <div style={appStyle}>
            <div style={contentStyle}>
                {token ? (
                    // If user is logged in, show Dashboard
                    <Dashboard
                        onLogout={handleLogout}
                        username={username}
                    />
                ) : (
                    // If user is not logged in, show either Registration or LoginPage
                    isRegistering ? (
                        // Show Registration form
                        <Registration
                            onLogin={handleLogin}
                            onBackToLogin={handleBackToLogin}
                        />
                    ) : (
                        // Show Login form
                        <LoginPage
                            onLogin={handleLogin}
                            onRegisterClick={handleRegisterClick}
                        />
                    )
                )}
            </div>
        </div>
    );
}

export default App;

// Optional: Add PropTypes for type checking
import PropTypes from 'prop-types';

Dashboard.propTypes = {
    onLogout: PropTypes.func.isRequired,
    username: PropTypes.string
};

LoginPage.propTypes = {
    onLogin: PropTypes.func.isRequired,
    onRegisterClick: PropTypes.func.isRequired
};

Registration.propTypes = {
    onLogin: PropTypes.func.isRequired,
    onBackToLogin: PropTypes.func.isRequired
};
