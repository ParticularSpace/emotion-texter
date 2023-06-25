import React from 'react';
import { Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;
`;

const Title = styled(Typography)`
  margin-bottom: 5rem;
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

const StyledButton = styled(Button)`
  animation: ${pulse} 2s infinite;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  margin: 1rem 0; // Add margin to the top and bottom of each link
`;

const LandingPage = () => {
  return (
    <Container>
      <Title variant="h2">
        Welcome to Chat Bot!
      </Title>
      <Typography variant="h6">
        The world is at your fingertips.
      </Typography>
      <StyledLink to="/tryit">
        <StyledButton variant="contained" color="primary" size="large">
          Try it out
        </StyledButton>
      </StyledLink>
      <StyledLink to="/login">
        <StyledButton variant="contained" color="secondary" size="large">
          Login
        </StyledButton>
      </StyledLink>
    </Container>
  );
};

export default LandingPage;
