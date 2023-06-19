import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { TextField, Button, Paper, Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';

const Container = styled(Paper)`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 300px;
  margin: auto;
  margin-top: 6rem; // additional spacing from the header
`;

const StyledButton = styled(Button)`
  margin-top: 1rem !important;
`;

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [open, setOpen] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setErrorMessage(''); // Reset the error message
    setOpen(false); // Reset the Snackbar

    // Check if passwords match
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      setOpen(true);
      return;
    }

    const user = {
      username,
      password
    };

    try {
      await axios.post('http://localhost:5000/register', user);
    } catch (error) {
      setErrorMessage(error.response.data.error);
      setOpen(true);
    }
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Username"
          variant="outlined"
          value={username}
          onChange={e => setUsername(e.target.value)}
          fullWidth
        />
        <TextField
          label="Password"
          variant="outlined"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          fullWidth
          style={{ marginTop: '1rem' }}
        />
        <TextField
          label="Confirm Password"
          variant="outlined"
          type="password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          fullWidth
          style={{ marginTop: '1rem' }}
        />
        <StyledButton variant="contained" type="submit" fullWidth>
          Register
        </StyledButton>
      </form>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <MuiAlert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </MuiAlert>
      </Snackbar>
    </Container>
  );
}

export default Register;
