import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const StyledLink = styled(Link)`
  color: inherit;
  text-decoration: none;
`;

const StyledAppBar = styled(AppBar)`
  margin-bottom: 2rem;
`;

const Header = () => {
  const location = useLocation();

  return (
    <StyledAppBar position="static" color="default">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          <StyledLink to="/">Chat Bot</StyledLink>
        </Typography>
        <Button color="inherit">
          <StyledLink to="/tryit">Try It</StyledLink>
        </Button>
        <Button color="inherit">
          {location.pathname === "/tryit" ? (
            <StyledLink to="/register">Register</StyledLink>
          ) : (
            <StyledLink to="/login">Login</StyledLink>
          )}
        </Button>
      </Toolbar>
    </StyledAppBar>
  );
};

export default Header;
