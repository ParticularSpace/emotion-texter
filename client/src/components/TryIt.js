import React, { useState, useRef, useEffect } from 'react';
import { Box, Card, TextField, Typography, Button, Grid } from '@mui/material';
import styled from 'styled-components';
import axios from 'axios';


const BouncingDot = styled('span')({
  animation: 'bounce 0.6s infinite',
  '&:nth-of-type(2)': {
    animationDelay: '0.2s',
  },
  '&:nth-of-type(3)': {
    animationDelay: '0.4s',
  },
  '@keyframes bounce': {
    '0%, 80%, 100%': {
      transform: 'translateY(0)',
    },
    '40%': {
      transform: 'translateY(-5px)',
    },
    '60%': {
      transform: 'translateY(-3px)',
    },
  },
});



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
  const [isTyping, setIsTyping] = useState(false);
  const [userMessage, setUserMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'AI',
      content: 'Welcome to Emotion Texter! How are you feeling today?',
    },
  ]);

  const messagesEndRef = useRef(null);

  const handleFormSubmit = (e) => {
    e.preventDefault(); // Prevent the form from refreshing the page
    handleSend();
  };


  const handleSend = async () => {
    const newMessage = {
      sender: 'You',
      content: userMessage,
    };

    // Add user's message to the state
    setMessages(prevMessages => [...prevMessages, newMessage]);

    try {
      setIsTyping(true);
      // Make a POST request to the /api/ai endpoint
      const response = await axios.post('http://localhost:3005/api/ai', { prompt: userMessage });



      // Get the AI's reply from the response
      // The AI's reply is in the 'choices' array in the response data
      // We're assuming that there's only one choice (which is the case if you didn't specify 'max_responses' in your API call)
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
      if (error.response) {
        setIsTyping(false);
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Request:', error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error message:', error.message);
      }
    }

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
          </Message>
        ))}
        <div ref={messagesEndRef} />
        {isTyping && (
          <Typography variant="body1">
            <strong>AI:</strong> is typing
            <BouncingDot>.</BouncingDot>
            <BouncingDot>.</BouncingDot>
            <BouncingDot>.</BouncingDot>
          </Typography>
        )}
        <div ref={messagesEndRef} />
      </ChatWindow>
      <Grid container spacing={2}  justifyContent="center" style={{marginTop: '1rem'}}>
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
    <Grid item xs={4} >
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
    </ChatContainer>
  );
};

export default TryIt;
