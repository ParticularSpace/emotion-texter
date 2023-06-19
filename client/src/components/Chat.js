import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Box, TextField, Button, Typography } from '@mui/material';
import styled from 'styled-components';

const MessageContainer = styled(Box)`
  overflow-y: auto;
  height: 70vh;
  border: 1px solid black;
  margin-bottom: 1rem;
  padding: 1rem;
`;

function Chat() {
  const [message, setMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const newSocket = io.connect('http://localhost:5000');
    setSocket(newSocket);
    
    newSocket.on('message', (newMessage) => {
      setMessages((messages) => [...messages, newMessage]);
    });

    return () => newSocket.disconnect();
  }, []);

  const sendMessage = e => {
    e.preventDefault();

    if (socket) {
      socket.emit('message', { sender: 'test', recipient: 'test', content: message });
      setMessage('');
    }
  };

  return (
    <>
      <MessageContainer>
        {messages.map((message, index) => (
          <Typography key={index}>{message.content}</Typography>
        ))}
      </MessageContainer>
      <form onSubmit={sendMessage}>
        <TextField
          type="text"
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Type a message"
        />
        <Button type="submit">Send</Button>
      </form>
    </>
  );
}

export default Chat;
