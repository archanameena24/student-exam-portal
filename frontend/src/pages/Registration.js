// src/pages/Registration.js
import React, { useState } from 'react';
import { authAPI, setAuthToken } from '../services/api';

export default function Registration({ onLogin, onBackToLogin }) {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            // Use authAPI for registration
            const response = await authAPI.register({
                username: formData.username,
                email: formData.email,
                password: formData.password
            });

            // Handle successful registration
            if (response.data.token) {
                // Set token in localStorage
                localStorage.setItem('token', response.data.token);
                // Set token in axios headers
                setAuthToken(response.data.token);
                // Call onLogin callback
                onLogin(response.data.token);
            } else {
                setError('Registration failed - No token received');
            }
        } catch (error) {
            // Handle different types of errors
            if (error.response) {
                // Server responded with error
                setError(error.response.data.message || 'Registration failed');
            } else if (error.request) {
                // No response received
                setError('Network error - Please try again');
            } else {
                // Other errors
                setError('Registration failed - Please try again');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    return (
        <div className="registration-container">
            <h2>Register</h2>
            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        minLength="6"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password:</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        minLength="6"
                    />
                </div>

                <div className="form-actions">
                    <button
                        type="submit"
                        disabled={loading}
                        className="submit-button"
                    >
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                    <button
                        type="button"
                        onClick={onBackToLogin}
                        disabled={loading}
                        className="back-button"
                    >
                        Back to Login
                    </button>
                </div>
            </form>

            <style jsx>{`
                .registration-container {
                    max-width: 400px;
                    margin: 0 auto;
                    padding: 20px;
                }

                .form-group {
                    margin-bottom: 15px;
                }

                .form-group label {
                    display: block;
                    margin-bottom: 5px;
                }

                .form-group input {
                    width: 100%;
                    padding: 8px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                }

                .error-message {
                    color: #dc3545;
                    padding: 10px;
                    margin-bottom: 15px;
                    border: 1px solid #dc3545;
                    border-radius: 4px;
                    background-color: #f8d7da;
                }

                .form-actions {
                    display: flex;
                    gap: 10px;
                    margin-top: 20px;
                }

                .submit-button, .back-button {
                    padding: 10px 20px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                }

                .submit-button {
                    background-color: #007bff;
                    color: white;
                }

                .submit-button:disabled {
                    background-color: #ccc;
                    cursor: not-allowed;
                }

                .back-button {
                    background-color: #6c757d;
                    color: white;
                }

                .back-button:disabled {
                    background-color: #ccc;
                    cursor: not-allowed;
                }
            `}</style>
        </div>
    );
}
