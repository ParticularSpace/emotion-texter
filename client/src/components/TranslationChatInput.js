import React, { useState } from 'react';
import { TextField, Button, Grid, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import axios from 'axios'; 

const TranslationChatInput = ({ handleSend: sendToServer, setMessages, setIsTyping }) => {
    const [userMessage, setUserMessage] = useState('');
    const [language, setLanguage] = useState('es'); // Default language is Spanish
  
    const handleFormSubmit = (e) => {
      e.preventDefault(); // Prevent the form from refreshing the page
      handleSend(userMessage, language);
      setUserMessage('');
    };
  
    const handleSend = async (message, language) => {
        const newMessage = {
          sender: 'You',
          content: message,
        };
      
        // Add user's message to the state
        setMessages(prevMessages => [...prevMessages, newMessage]);
      
        try {
          setIsTyping(true);
          // Make a POST request to the /api/ai endpoint
          const requestBody = { prompt: message, mode: 'translation', language: language };
          const response = await axios.post('http://localhost:3005/api/ai', requestBody);
      
          // Get the AI's reply from the response
          const aiReply = response.data.choices[0].text;
      
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
    <Grid container spacing={2} justifyContent="center" style={{ marginTop: '1rem' }}>
      <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center' }}>
        <Grid container item xs={12} spacing={2} alignItems="center">
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
            <FormControl fullWidth variant="outlined">
              <InputLabel id="demo-simple-select-outlined-label">To:</InputLabel>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                value={language}
                onChange={e => setLanguage(e.target.value)}
                varient="outlined"
                label="To:"
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 48 * 4.5, // where 48 is the item height and 4.5 is the number of items visible at a time
                      width: '20ch',
                    },
                  },
                }}
              >
                <MenuItem value="es">Spanish</MenuItem>
                <MenuItem value="fr">French</MenuItem>
                <MenuItem value="de">German</MenuItem>
                <MenuItem value="it">Italian</MenuItem>
                <MenuItem value="ja">Japanese</MenuItem>
                <MenuItem value="ko">Korean</MenuItem>
                <MenuItem value="pt">Portuguese</MenuItem>
                <MenuItem value="ru">Russian</MenuItem>
                <MenuItem value="zh">Chinese</MenuItem>
                <MenuItem value="ar">Arabic</MenuItem>
                <MenuItem value="hi">Hindi</MenuItem>
                <MenuItem value="tr">Turkish</MenuItem>
                <MenuItem value="vi">Vietnamese</MenuItem>
                <MenuItem value="th">Thai</MenuItem>
                <MenuItem value="id">Indonesian</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Grid item xs={12} style={{ marginTop: '1rem' }}>
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

export default TranslationChatInput;
