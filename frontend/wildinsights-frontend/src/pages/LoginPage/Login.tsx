/* eslint-disable react/no-unescaped-entities */
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  InputAdornment,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import HttpsIcon from "@mui/icons-material/Https";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import axiosclient from "../../components/Apiclient/axiosclient";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [images, setImages] = useState([]); // State to hold images
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // State for current image index
  const navigate = useNavigate();

  // Function to fetch images from the API
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axiosclient.get("/home_page"); // Replace with your API endpoint
        setImages(response.data.data); // Assume response.data.data is an array of images
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };
    fetchImages();
  }, []);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError("Username and password are required");
      return;
    }
    try {
      await axiosclient.post("/login", { username, password });
      navigate("/");
    } catch (error) {
      if (error.response) {
        setError(`Login failed: ${error.response.data.detail || error.message}`);
      } else if (error.request) {
        setError("Server did not respond. Please try again later.");
      } else {
        setError(`An error occurred: ${error.message}`);
      }
    }
  };

  const handleForgotPassword = () => {
    console.log("Email for password reset:", email);
    setForgotPasswordOpen(false);
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePreviousImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  return (
    <Container component="main" maxWidth="lg" sx={{ height: "100vh", display: "flex" }}>
      <Grid container sx={{ height: "100vh", position: "relative" }}>
        {/* Left Section: Image Viewer */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            bgcolor: "#f5f5f5",
            position: "absolute",
            left: "-198px",
            "&:hover .arrowButton": {
              visibility: "visible", // Show arrows only on hover
            },
          }}
        >
          {/* Arrow for Previous Image */}
          <IconButton
            onClick={handlePreviousImage}
            disabled={images.length === 0}
            className="arrowButton"
            sx={{
              position: "absolute",
              left: 10,
              visibility: "hidden", // Initially hidden
              zIndex: 2,
              color: "#fff",
              bgcolor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
              "&:hover": { bgcolor: "rgba(0, 0, 0, 0.7)" }, // Darken on hover
            }}
          >
            <ArrowBackIosIcon />
          </IconButton>

          {/* Display current image */}
          {images.length > 0 && (
            <Box
              component="img"
              src={images[currentImageIndex].image} // Update the image URL based on your response
              alt={`Image ${currentImageIndex + 1}`}
              sx={{
                height: "80%",
                width: "80%",
                objectFit: "contain",
                position: "relative",
              }}
            />
          )}

          {/* Arrow for Next Image */}
          <IconButton
            onClick={handleNextImage}
            disabled={images.length === 0}
            className="arrowButton"
            sx={{
              position: "absolute",
              right: 10,
              visibility: "hidden", // Initially hidden
              zIndex: 2,
              color: "#fff",
              bgcolor: "rgba(0, 0, 0, 0.5)",
              "&:hover": { bgcolor: "rgba(0, 0, 0, 0.7)" },
            }}
          >
            <ArrowForwardIosIcon />
          </IconButton>

          {/* Display image description at the bottom of the image */}
          {images.length > 0 && (
            <Box
              sx={{
                position: "absolute",
                bottom: "10px",
                width: "100%",
                bgcolor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
                color: "#fff",
                textAlign: "center",
                p: 1,
              }}
            >
              <Typography variant="subtitle1">{images[currentImageIndex].common_name}</Typography>
            </Box>
          )}
        </Grid>

        {/* Right Section: Login Form */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginLeft: "auto",
          }}
        >
          <Paper elevation={3} sx={{ p: 4, width: "80%" }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography component="h1" variant="h5">
                Login
              </Typography>
              <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon />
                      </InputAdornment>
                    ),
                  }}
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                  autoFocus
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <HttpsIcon />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={togglePasswordVisibility}>
                          {passwordVisible ? <VisibilityIcon /> : <VisibilityOffIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  name="password"
                  label="Password"
                  type={passwordVisible ? "text" : "password"}
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Typography
                  variant="body2"
                  sx={{ mt: 1, cursor: "pointer", color: "#1976d2" }}
                  onClick={() => setForgotPasswordOpen(true)}
                >
                  Forgot Password?
                </Typography>
                <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                  Login
                </Button>
                <Dialog open={forgotPasswordOpen} onClose={() => setForgotPasswordOpen(false)}>
                  <DialogTitle>Forgot Password</DialogTitle>
                  <DialogContent>
                    <Typography sx={{ marginBlockEnd: 1 }}>
                      We will send your password via email
                    </Typography>
                    <TextField
                      autoFocus
                      margin="dense"
                      id="email"
                      label="Email Address"
                      type="email"
                      fullWidth
                      variant="outlined"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={() => setForgotPasswordOpen(false)} color="primary">
                      Cancel
                    </Button>
                    <Button onClick={handleForgotPassword} color="primary">
                      Submit
                    </Button>
                  </DialogActions>
                </Dialog>
              </Box>
              {error && <Typography color="error">{error}</Typography>}
              <Typography justifyContent={"center"}>
                Don't have an account?
                <Box
                  component={Link}
                  to="/register"
                  sx={{
                    textDecoration: "none",
                    color: "inherit",
                    "&:hover": {
                      color: "#1976d2",
                      cursor: "pointer",
                    },
                  }}
                >
                  Signup
                </Box>
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Login;
