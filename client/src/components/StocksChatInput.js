import React, { useState } from 'react';
import { TextField, Button, Grid } from '@mui/material';
import axios from 'axios';

const StocksChatInput = ({ setMessages, setIsTyping }) => {
  const [ticker, setTicker] = useState('');

  const handleFormSubmit = (e) => {
    e.preventDefault(); // Prevent the form from refreshing the page
    handleSend(ticker);
    setTicker('');
  };

  const handleSend = async (ticker) => {
    const newMessage = {
      sender: 'You',
      content: ticker,
    };
  
    // Add user's message to the state
    setMessages(prevMessages => [...prevMessages, newMessage]);
  
    try {
      setIsTyping(true);
      // Make a POST request to the /api/ai endpoint
      const requestBody = { prompt: ticker, mode: 'stocks' };
      const response = await axios.post('http://localhost:3005/api/ai', requestBody);
  
      console.log(response.data);
  
      // Get the AI's reply from the response
      const aiReply = response.data.analysis; // Corrected line
  
      const AIReply = {
        sender: 'AI',
        content: aiReply,
      };
  
      // Add AI's reply to the state
      setMessages(prevMessages => [...prevMessages, AIReply]);
      setIsTyping(false);
    } catch (error) {
      console.error(error);
      setIsTyping(false);
    }
  };
  

  return (
    <form onSubmit={handleFormSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={9}>
          <TextField
            fullWidth
            id="outlined-basic"
            label="Type your ticker here..."
            variant="outlined"
            value={ticker}
            onChange={e => setTicker(e.target.value)}
          />
        </Grid>
        <Grid item xs={3}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            disabled={!ticker}
          >
            Send
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default StocksChatInput;
