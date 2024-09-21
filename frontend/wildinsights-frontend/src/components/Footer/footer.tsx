import React from "react";
import { Box, IconButton, Link, Typography } from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import TwitterIcon from "@mui/icons-material/Twitter";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";

const Footer: React.FC = () => {

  const socialLinks = {
    twitter: "https://twitter.com/yourhandle",
    facebook: "https://facebook.com/yourhandle",
    instagram: "https://instagram.com/yourhandle",
    linkedin: "https://linkedin.com/in/yourprofile",
    github: "https://github.com/yourprofile",
  };

  return (
    <Box
      component="footer"
      sx={{
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        backgroundColor: "#eaf3d8",
        borderTop: "1px solid #e0e0e0",
      }}
    >
      {/* Help Section */}
      <Box sx={{ marginTop: 5 }}>
        <Link
          href="/help"
          underline="none"
          sx={{ display: "flex", alignItems: "center" }}
        >
          <HelpOutlineIcon sx={{ mr: 1 }} />
          <Typography variant="body1">Help</Typography>
        </Link>
        <Link href="/forums" underline="none">
          <Typography variant="body1" color="primary">
            Forums
          </Typography>
        </Link>
        <Link href="/terms-of-use" underline="none">
          <Typography variant="body1" color="primary">
            Terms of Use
          </Typography>
        </Link>
        <Link href="/privacy" underline="none">
          <Typography variant="body1" color="primary">
            Privacy
          </Typography>
        </Link>
        <Link href="/community-guidelines" underline="none">
          <Typography variant="body1" color="primary">
            Community Guidelines
          </Typography>
        </Link>
      </Box>

      {/* Social Icons Section */}
      <Box>
        <IconButton
          component="a"
          href={socialLinks.twitter}
          target="_blank"
          rel="noopener noreferrer"
        >
          <TwitterIcon fontSize="large" />
        </IconButton>
        <IconButton
          component="a"
          href={socialLinks.facebook}
          target="_blank"
          rel="noopener noreferrer"
        >
          <FacebookIcon fontSize="large" />
        </IconButton>
        <IconButton
          component="a"
          href={socialLinks.instagram}
          target="_blank"
          rel="noopener noreferrer"
        >
          <InstagramIcon fontSize="large" />
        </IconButton>
        <IconButton
          component="a"
          href={socialLinks.linkedin}
          target="_blank"
          rel="noopener noreferrer"
        >
          <LinkedInIcon fontSize="large" />
        </IconButton>
        <IconButton
          component="a"
          href={socialLinks.github}
          target="_blank"
          rel="noopener noreferrer"
        >
          <GitHubIcon fontSize="large" />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Footer;
