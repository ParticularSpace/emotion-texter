import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

function Chat() {
  const [message, setMessage] = useState('');
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io.connect('http://localhost:5000');
    setSocket(newSocket);
    
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
    <form onSubmit={sendMessage}>
      <input
        type="text"
        value={message}
        onChange={e => setMessage(e.target.value)}
        placeholder="Type a message"
      />
      <button type="submit">Send</button>
    </form>
  );
}

export default Chat;
