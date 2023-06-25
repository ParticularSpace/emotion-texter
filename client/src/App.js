// App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import LandingPage from './components/LandingPage';
import TryIt from './components/TryIt';
import Login from './components/Login';
import Header from './components/Header';
import Register from './components/Register';

const theme = createTheme({
  palette: {
    primary: {
      main: '#000000',  
    },
    secondary: {
      main: '#FFFFFF',  
    },
  },
  typography: {
    fontFamily: 'Arial',
  },
  shape: {
    borderRadius: 15,  
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/tryit" element={<TryIt />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
