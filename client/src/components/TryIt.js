import React, { useState, useRef, useEffect } from 'react';
import { Box, Card, TextField, Typography, Button, Grid } from '@mui/material';
import styled from 'styled-components';

const ChatContainer = styled(Card)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 70vh;
  width: 100%;
  max-width: 600px;
  padding: 2rem;
  margin: 2rem auto;
  @media (min-width: 768px) {
    width: 60vw;
  }
`;

const ChatWindow = styled(Box)`
  width: 100%;
  height: 85%;
  overflow-y: auto;
  border: 1px solid #000;
  padding: 1rem;
  margin-bottom: 1rem;
`;

const Message = styled(Box)`
  width: 100%;
  margin-bottom: 1rem;
`;

const TryIt = () => {
  const [userMessage, setUserMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'AI',
      content: 'Welcome to Emotion Texter! How are you feeling today?',
      sentiment: 'Neutral',
    },
  ]);

  const messagesEndRef = useRef(null);

  const handleSend = () => {
    const newMessage = {
      sender: 'User',
      content: userMessage,
      sentiment: 'Neutral', // This should be updated with the real sentiment value
    };

    // Mocking AI's reply
    const AIReply = {
      sender: 'AI',
      content: 'I am just an AI, I don\'t have feelings, but thanks for asking!',
      sentiment: 'Neutral',
    };
    
    // Add both messages in a single state update
    setMessages(prevMessages => [...prevMessages, newMessage, AIReply]);
    setUserMessage('');
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <ChatContainer>
      <Typography variant="h4" gutterBottom>
        Chat with our AI
      </Typography>
      <ChatWindow>
        {messages.map((message, index) => (
          <Message key={index}>
            <Typography variant="body1">
              <strong>{message.sender}:</strong> {message.content}
            </Typography>
            <Typography variant="caption" display="block" gutterBottom>
              Sentiment: {message.sentiment}
            </Typography>
          </Message>
        ))}
        <div ref={messagesEndRef} />
      </ChatWindow>
      <Grid container spacing={2} alignItems="center" style={{marginTop: '1rem'}}>
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
            onClick={handleSend}
            disabled={!userMessage}
          >
            Send
          </Button>
        </Grid>
      </Grid>
    </ChatContainer>
  );
};

export default TryIt;
