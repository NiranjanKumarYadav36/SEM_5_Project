import React, { useState } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Button,
  Container,
  Avatar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import useHandleLogout from "../Logout/logout";
import logo from "../../assets/NavBar/logo.png"; // Adjust path as needed

const Navbar = () => {
  const navigate = useNavigate(); // Create navigate function
  const handleLogout = useHandleLogout();
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [anchorElCommunity, setAnchorElCommunity] = useState<null | HTMLElement>(null);
  const [anchorElObservation, setAnchorElObservation] = useState<null | HTMLElement>(null); // New for observations

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

  const handleMenuOpenCommunity = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElCommunity(event.currentTarget);
  };

  const handleMenuCloseCommunity = () => {
    setAnchorElCommunity(null);
  };

  const handleMenuOpenObservation = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElObservation(event.currentTarget);
  };

  const handleMenuCloseObservation = () => {
    setAnchorElObservation(null);
  };

  const handlehomechange = () => {
    navigate("/"); // Navigate to home when the logo is clicked
  };

  const menuItems = [
    { text: "Explore", link: "/explore" },
    { text: "Community", link: "#" },
    { text: "Identify", link: "/identify" },
    { text: "Observations", link: "#" },
  ];

  const communityItems = [
    { text: "People", link: "/community/people" },
    { text: "Projects", link: "/"}
  ];

  const observationItems = [
    { text: "Your Observations", link: "/observation/me" },
    { text: "Add Observation", link: "/observation/add" },
    { text: "Edit Observation", link: "/observation/edit" },
  ];

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "#3d928d",
        boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.2)",
        padding: "10px 0",
      }}
    >
      <Container
        maxWidth={false}
        sx={{ padding: 0, marginLeft: 0, marginRight: 0 }}
      >
        <Toolbar disableGutters>
          {/* Logo and Title Section */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              marginLeft: 2, // Space between logo and the edge
            }}
          >
            {/* Logo Image */}
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Button onClick={handlehomechange}>
                <img
                  src={logo} // Image source from imported logo
                  alt="Logo"
                  style={{
                    height: "40px",
                    marginRight: "10px",
                    backgroundColor: "transparent", // Ensure image background is transparent
                  }}
                />
                {/* Title Text (Non-clickable, Black) */}
                <Typography
                  variant="h6"
                  component="div"
                  sx={{ fontWeight: "bold", color: "#000", display: "flex" }}
                >
                  WildInsights
                </Typography>
              </Button>
            </Box>
          </Box>

          {/* Links for large screens */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 3, ml: 3 }}>
            {menuItems.map((item) =>
              item.text === "Community" ? (
                <Box
                  key={item.text}
                  onMouseEnter={handleMenuOpenCommunity}
                  onMouseLeave={handleMenuCloseCommunity}
                >
                  <Button
                    sx={{
                      color: "#fff",
                      textTransform: "none",
                      fontSize: "1rem",
                      transition: "background-color 0.3s",
                      "&:hover": {
                        backgroundColor: "#2b6f6b",
                      },
                    }}
                    onClick={handleMenuOpenCommunity}
                  >
                    {item.text}
                  </Button>
                  <Menu
                    anchorEl={anchorElCommunity}
                    anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                    transformOrigin={{ vertical: "top", horizontal: "left" }}
                    keepMounted
                    open={Boolean(anchorElCommunity)}
                    onClose={handleMenuCloseCommunity}
                  >
                    {communityItems.map((subItem) => (
                      <MenuItem
                        key={subItem.text}
                        component={Link}
                        to={subItem.link}
                        onClick={handleMenuCloseCommunity}
                      >
                        {subItem.text}
                      </MenuItem>
                    ))}
                  </Menu>
                </Box>
              ) : item.text === "Observations" ? (
                <Box
                  key={item.text}
                  onMouseEnter={handleMenuOpenObservation} // Open on hover for observations
                  onMouseLeave={handleMenuCloseObservation} // Close when mouse leaves
                >
                  <Button
                    sx={{
                      color: "#fff",
                      textTransform: "none",
                      fontSize: "1rem",
                      transition: "background-color 0.3s",
                      "&:hover": {
                        backgroundColor: "#2b6f6b",
                      },
                    }}
                    onClick={handleMenuOpenObservation}
                  >
                    {item.text}
                  </Button>
                  <Menu
                    anchorEl={anchorElObservation}
                    anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                    transformOrigin={{ vertical: "top", horizontal: "left" }}
                    keepMounted
                    open={Boolean(anchorElObservation)}
                    onClose={handleMenuCloseObservation}
                  >
                    {observationItems.map((subItem) => (
                      <MenuItem
                        key={subItem.text}
                        component={Link}
                        to={subItem.link}
                        onClick={handleMenuCloseObservation}
                      >
                        {subItem.text}
                      </MenuItem>
                    ))}
                  </Menu>
                </Box>
              ) : (
                <Button
                  key={item.text}
                  component={Link}
                  to={item.link}
                  sx={{
                    color: "#fff",
                    textTransform: "none",
                    fontSize: "1rem",
                    transition: "background-color 0.3s",
                    "&:hover": {
                      backgroundColor: "#2b6f6b",
                    },
                  }}
                >
                  {item.text}
                </Button>
              )
            )}
          </Box>

          {/* Hamburger menu for small screens */}
          <Box sx={{ display: { xs: "block", md: "none" }, ml: "auto" }}>
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
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
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
          <Box
            onMouseEnter={handleMenuOpenUser}
            onMouseLeave={handleMenuCloseUser}
            sx={{
              display: "flex",
              alignItems: "center",
              marginLeft: "auto",
              marginRight: 3,
            }}
          >
            <IconButton onClick={handleMenuOpenUser} sx={{ p: 0 }}>
              <Avatar alt="Profile Picture" src="/static/images/avatar/1.jpg" />
            </IconButton>
            <Menu
              anchorEl={anchorElUser}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              keepMounted
              open={Boolean(anchorElUser)}
              onClose={handleMenuCloseUser}
            >
              <MenuItem
                component={Link}
                to="/user/dashboard"
                onClick={handleMenuCloseUser}
              >
                Dashboard
              </MenuItem>
              <MenuItem
                component={Link}
                to="/user/profile"
                onClick={handleMenuCloseUser}
              >
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