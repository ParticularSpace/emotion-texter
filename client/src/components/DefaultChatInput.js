import React, { useState } from 'react';
import { TextField, Button, Grid } from '@mui/material';
import axios from 'axios';

const DefaultChatInput = ({ setMessages, setIsTyping }) => {
  console.log('DefaultChatInput');
  const [userMessage, setUserMessage] = useState('');

  const handleFormSubmit = (e) => {
    e.preventDefault(); // Prevent the form from refreshing the page
    handleSend(userMessage);
    setUserMessage('');
  };

  const handleSend = async (message) => {
    const newMessage = {
      sender: 'You',
      content: message,
    };

    // Add user's message to the state
    setMessages(prevMessages => [...prevMessages, newMessage]);

    try {
      setIsTyping(true);
      // Make a POST request to the /api/ai endpoint
      const requestBody = { prompt: message, mode: 'default' };
      const response = await axios.post('http://localhost:3005/api/ai', requestBody);

      // Get the AI's reply from the response
      const aiReply = response.data.choices[0].message.content;

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
            label="Type your message here..."
            variant="outlined"
            value={userMessage}
            onChange={e => setUserMessage(e.target.value)}
          />
        </Grid>
        <Grid item xs={3}>
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
      </Grid>
    </form>
  );
};

export default DefaultChatInput;
