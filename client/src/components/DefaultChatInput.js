import React, { useState } from 'react';
import { TextField, Button, Grid } from '@mui/material';

const DefaultChatInput = ({ handleSend }) => {
  const [userMessage, setUserMessage] = useState('');

  const handleFormSubmit = (e) => {
    e.preventDefault(); // Prevent the form from refreshing the page
    handleSend(userMessage);
    setUserMessage('');
  };

  return (
    <Grid container spacing={2} justifyContent="center" style={{ marginTop: '1rem' }}>
      <form onSubmit={handleFormSubmit} style={{ display: 'flex', width: '100%', alignItems: 'center' }}>
        <Grid item xs={8}>
          <TextField
            fullWidth
            id="outlined-basic"
            label="Type your message here..."
            variant="outlined"
            value={userMessage}
            onChange={e => setUserMessage(e.target.value)}
          />
        </Grid>
        <Grid item xs={4}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            disabled={!userMessage}
          >
            Send
          </Button>
        </Grid>
      </form>
    </Grid>
  );
};

export default DefaultChatInput;
