import React from 'react';
import { Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
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
  margin-bottom: 5rem;
`;

const StyledButton = styled(Button)`
  margin-top: 2rem;
  margin-bottom: 2rem;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
`;

const LandingPage = () => {
  return (
    <Container>
      <Title variant="h2">
        Welcome to Emotion Texter!
      </Title>
      <Typography variant="h6">
        Emotions are hard to express through text. We're here to help!
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
