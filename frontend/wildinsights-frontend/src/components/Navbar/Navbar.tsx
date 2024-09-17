import React, { useState } from 'react';
import { AppBar, Box, Toolbar, IconButton, Typography, Menu, MenuItem, Button,Container,Avatar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';
import useHandleLogout from '../Logout/logout';

const Navbar = () => {
  const handleLogout = useHandleLogout();
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleMenuOpenNav = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleMenuCloseNav = () => {
    setAnchorElNav(null);
  };

  const handleMenuOpenUser = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleMenuCloseUser = () => {
    setAnchorElUser(null);
  };

  const menuItems = [
    { text: 'Home', link: '/' },
    { text: 'Explore', link: '/explore' },
    { text: 'Community', link: '/community' },
    { text: 'Contribute', link: '/contribute' },
  ];

  return (
    <AppBar
      position="static"
      sx={{
      backgroundColor: '#3d928d',
      boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.2)',
      padding: '10px 0',
      }}
    >
    <Container maxWidth={false} sx={{ padding:0, marginLeft:0, marginRight:0, }}>
      <Toolbar disableGutters >
        {/*Improve this */}
        <Typography
          variant="h6"
          component="div"
          sx={{  fontWeight: 'bold', display: 'flex', margin:3}}
        >WildInsights
        </Typography>

        {/* Links for large screens */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3 }}>
          {menuItems.map((item) => (
            <Button
              key={item.text}
              component={Link}
              to={item.link}
              sx={{
                color: '#fff',
                textTransform: 'none',
                fontSize: '1rem',
                transition: 'background-color 0.3s',
                '&:hover': {
                  backgroundColor: '#2b6f6b', // Darker shade on hover
                },
              }}
            >
              {item.text}
            </Button>
          ))}
        </Box>

        {/* Hamburger menu for small screens */}
        <Box sx={{ display: { xs: 'block', md: 'none' } }}>
          <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleMenuOpenNav}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorElNav}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              keepMounted
              open={Boolean(anchorElNav)}
              onClose={handleMenuCloseNav}
            >
              {menuItems.map((item) => (
                <MenuItem
                  key={item.text}
                  component={Link}
                  to={item.link}
                  onClick={handleMenuCloseNav}
                >
                  {item.text}
                </MenuItem>
              ))}
            </Menu>
        </Box>
        

        {/* Profile and Dropdown Menu */}
        <Box sx={{ display: 'flex', alignItems: 'center', marginLeft:"auto" ,marginRight:3 }}>
          <IconButton onClick={handleMenuOpenUser} sx={{ p: 0 }}>
            <Avatar alt="Profile Picture" src="/static/images/avatar/1.jpg" />
          </IconButton>
          <Menu
            anchorEl={anchorElUser}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            keepMounted
            open={Boolean(anchorElUser)}
            onClose={handleMenuCloseUser}
          >
            <MenuItem component={Link} to="/profile" onClick={handleMenuCloseUser}>
              Profile
            </MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </Container>
    </AppBar>
  );
};

export default Navbar;