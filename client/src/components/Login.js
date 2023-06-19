import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography } from '@mui/material';
import styled from 'styled-components';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const StyledTextField = styled(TextField)`
  margin-bottom: 2rem !important;
`;

const StyledButton = styled(Button)`
  margin-top: 2rem !important;
`;

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();

    const user = {
      username,
      password
    };

    try {
      const response = await axios.post('http://localhost:5000/login', user);
      if (response.data.error) {
        setError(response.data.error);
      } else {
        // Handle successful login. Redirect, show message, etc.
      }
    } catch(err) {
      setError('Something went wrong.');
    }
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Typography variant="h2">Login</Typography>
      {error && <p>{error}</p>}
      <StyledTextField 
        variant="outlined"
        label="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />
      <StyledTextField 
        variant="outlined"
        label="Password"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <StyledButton type="submit" variant="contained" color="primary">
        Login
      </StyledButton>
    </Form>
  );
}

export default Login;
