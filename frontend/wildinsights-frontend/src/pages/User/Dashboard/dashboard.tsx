import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Box, Button, Typography, Avatar } from "@mui/material"; // Import Avatar component
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import WorkIcon from '@mui/icons-material/Work';
import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/footer";

function UserDashboard() {
  // State to track the active item
  const [activeItem, setActiveItem] = useState("Home");

  // List of navigation items with labels, paths, and icons
  const navItems = [
    { label: "Home", path: "/", icon: <HomeIcon /> },
    { label: "Profile", path: "/user/dashboard", icon: <PersonIcon /> },
    { label: "Observations", path: "/observations", icon: <VisibilityIcon /> },
    { label: "Edit Observations", path: "/edit-observations", icon: <EditIcon /> },
    { label: "Identifications", path: "/identifications", icon: <EditIcon /> },
    { label: "Projects", path: "/community/projects", icon: <WorkIcon /> }
  ];

  return (
    <>
      {/* Navbar Component */}
      <Navbar />

      {/* Profile Section and Navigation Menu Container */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mt: 4, // Top margin to create space below the Navbar
          flexDirection: "column", // Align items in a column
        }}
      >
        {/* Profile Section */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 2, // Margin bottom to separate profile section from navigation menu
          }}
        >
          <Avatar
            src="https://via.placeholder.com/150" // Replace with actual profile image source
            alt="Profile Image"
            sx={{ width: 56, height: 56, mr: 2 }} // Styling for avatar size and spacing
          />
          <Typography variant="h6" sx={{ color: "#333" }}>
            John Doe {/* Replace with actual username */}
          </Typography>
        </Box>

        {/* Centered Navigation Menu with Rectangular Buttons */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* Wrapper for navigation items */}
          <Box
            sx={{
              display: "flex",
              gap: 1, // Space between each nav item
              borderBottom: "2px solid #e0e0e0", // Underline shared by all navigation items
              paddingBottom: 0,
              position: "relative",
            }}
          >
            {navItems.map((item) => (
              <Button
                key={item.label}
                component={Link}
                to={item.path}
                onClick={() => setActiveItem(item.label)}
                sx={{
                  padding: "6px 16px",
                  display: "flex", // Use flex to align icon and label
                  alignItems: "center", // Center the icon and text vertically
                  color: activeItem === item.label ? "#337ab7" : "#337ab7",
                  fontWeight: activeItem === item.label ? "bold" : "normal",
                  border: activeItem === item.label
                    ? "2px solid #4CAF50"
                    : "2px solid transparent", // Set border to green for active item
                  borderBottom: "none", // Remove bottom border of button to blend with underline
                  borderRadius: "6px 6px 0 0", // Rounded top corners only
                  transition: "border-color 0.3s ease-in-out",
                  position: "relative",
                  '&:hover': {
                    border: "2px solid #4CAF50",
                    color: "#4CAF50",
                    borderBottom: activeItem === item.label
                      ? "none" // Keep connected look on hover if active
                      : "2px solid #4CAF50", // Set bottom border on hover
                  },
                }}
              >
                {item.icon} {/* Add the icon here */}
                <Typography sx={{ ml: 1 }}>{item.label}</Typography> {/* Add left margin for spacing */}
              </Button>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Placeholder for Page Content */}
      <Box sx={{ minHeight: "calc(100vh - 200px)", padding: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          {activeItem} Page
        </Typography>
        <Typography align="center" sx={{ color: "#555" }}>
          {`You haven't added any ${activeItem.toLowerCase()} yet.`}
        </Typography>
      </Box>

      {/* Footer Component */}
      <Footer />
    </>
  );
}

export default UserDashboard;
