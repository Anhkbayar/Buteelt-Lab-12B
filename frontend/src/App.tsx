// src/App.tsx
import React, { useState } from 'react';

// Type definitions
type User = {
  id: number;
  username: string;
  password: string;
  role: string;
};

type AuthFormData = {
  username: string;
  password: string;
};

type AuthResponse = User | string; // Register returns User, Login returns string

const App: React.FC = () => {
  const [formData, setFormData] = useState<AuthFormData>({
    username: '',
    password: ''
  });
  const [message, setMessage] = useState<string>('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        throw new Error(`Registration failed with status: ${response.status}`);
      }
      
      const data: User = await response.json();
      setMessage(`Registration successful for user: ${data.username}`);
      setCurrentUser(data);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Registration failed');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        throw new Error(response.status === 401 
          ? 'Invalid credentials' 
          : `Login failed with status: ${response.status}`);
      }
      
      const data: string = await response.text();
      setMessage(data);
      
      // Fetch user details after successful login
      const userResponse = await fetch(`http://localhost:8080/api/users?username=${formData.username}`);
      if (userResponse.ok) {
        const userData: User = await userResponse.json();
        setCurrentUser(userData);
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Login failed');
    }
  };

  return (
    <div className="App" style={styles.app}>
      <h1>Authentication Demo</h1>
      
      {message && (
        <div style={styles.message}>
          {message}
        </div>
      )}
      
      {currentUser && (
        <div style={styles.userInfo}>
          <h3>Current User</h3>
          <p>Username: {currentUser.username}</p>
          <p>Role: {currentUser.role}</p>
        </div>
      )}

      <div style={styles.formContainer}>
        <h2>Register</h2>
        <form onSubmit={handleRegister} style={styles.form}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.registerButton}>
            Register
          </button>
        </form>
      </div>

      <div style={styles.formContainer}>
        <h2>Login</h2>
        <form onSubmit={handleLogin} style={styles.form}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.loginButton}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

// TypeScript styles
const styles = {
  app: {
    padding: '20px',
    maxWidth: '400px',
    margin: '0 auto',
    fontFamily: 'Arial, sans-serif'
  },
  message: {
    margin: '20px 0',
    padding: '10px',
    backgroundColor: '#f0f0f0',
    borderRadius: '4px'
  },
  userInfo: {
    margin: '20px 0',
    padding: '15px',
    backgroundColor: '#e8f5e9',
    border: '1px solid #c8e6c9',
    borderRadius: '4px'
  },
  formContainer: {
    marginBottom: '30px',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '4px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px'
  },
  input: {
    padding: '8px',
    border: '1px solid #ddd',
    borderRadius: '4px'
  },
  registerButton: {
    padding: '8px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  loginButton: {
    padding: '8px',
    backgroundColor: '#2196F3',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  }
};

export default App;