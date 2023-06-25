import React, { useState, useRef, useEffect } from 'react';
import { Box, Card, Typography, Select, MenuItem } from '@mui/material';
import styled from 'styled-components';
import axios from 'axios';
import StocksChatInput from './StocksChatInput';
import TranslationChatInput from './TranslationChatInput';
import DefaultChatInput from './DefaultChatInput.js';


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
  const [language, setLanguage] = useState('en');
  const [mode, setMode] = useState('default');

  const handleModeChange = (event) => {
    setMode(event.target.value);
  };

  const [messages, setMessages] = useState([
    {
      sender: 'AI',
      content: 'Hey! How are you doing?',
    },
  ]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <ChatContainer>
      <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={2}>
        <Typography variant="h4" gutterBottom>
          Chat with our AI
        </Typography>
        <Select
          value={mode}
          onChange={handleModeChange}
          variant="outlined"
        >
          <MenuItem value="default">Default</MenuItem>
          <MenuItem value="translation">Translation</MenuItem>
          <MenuItem value="stocks">Stocks</MenuItem>
        </Select>
      </Box>
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
      {mode === 'default' && <DefaultChatInput setMessages={setMessages} setIsTyping={setIsTyping} />}
{mode === 'translation' && <TranslationChatInput setMessages={setMessages} setIsTyping={setIsTyping} />}
{mode === 'stocks' && <StocksChatInput setMessages={setMessages} setIsTyping={setIsTyping} />}

    </ChatContainer>
  );
};


export default TryIt;
