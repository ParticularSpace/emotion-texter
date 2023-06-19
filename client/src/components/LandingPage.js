import React from 'react';
import { Typography, Button } from '@mui/material';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;
`;

const Title = styled(Typography)`
  margin-bottom: 2rem;
`;

const StyledButton = styled(Button)`
  margin-top: 2rem;
`;

const LandingPage = () => {
  return (
    <Container>
      <Title variant="h2">
        Welcome to Emotion Texter!
      </Title>
      <Typography variant="h6">
        Experience the new way of understanding emotions in your conversations.
        Connect with your friends, family and colleagues on a deeper level.
        Sign up today and get started.
      </Typography>
      <StyledButton variant="contained" color="primary" size="large">
        Sign Up
      </StyledButton>
    </Container>
  );
};

export default LandingPage;
