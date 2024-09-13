/* eslint-disable react/no-unescaped-entities */
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Container,Paper,Box,Typography,TextField,InputAdornment,Button,IconButton,Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import HttpsIcon from '@mui/icons-material/Https';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false); // State for Dialog
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate= useNavigate();
  
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleLogin = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/login', {
        username,  // Passing data here directly
        password
      }, {
        headers: { 'Content-Type': 'application/json' },  // This is the correct place for headers
        withCredentials: true  // Use `withCredentials` instead of `credentials`
      });
    navigate("/");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }catch (error: any) {
      if (error.response) {
        // Server responded with a status other than 2xx
        setError(`Registration failed: ${error.response.data.detail || error.message}`);
      } else if (error.request) {
        // Request was made but no response received
        setError('Server did not respond. Please try again later.');
      } else {
        // Something else caused the error
        setError(`An error occurred: ${error.message}`);
      }
    }
  };

  const handleForgotPassword = () => {
    // Here you can implement the logic to send the password reset email
    console.log('Email for password reset:', email);
    setForgotPasswordOpen(false); // Close the dialog after submission
  };


  return (
    <Container component="main" maxWidth="xs" sx={{ alignContent:"center"}}>
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
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
              label="username"
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
                      {passwordVisible ? <VisibilityIcon /> :  <VisibilityOffIcon /> }
                    </IconButton>
                  </InputAdornment>
                )
              }}
              name="password"
              label="Password"
              type={passwordVisible ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Typography
            variant="body2"
            sx={{ mt: 1, cursor: 'pointer', color: '#1976d2' }}
            onClick={() => setForgotPasswordOpen(true)} // Open dialog on click
            >
              Forgot Password?
            </Typography>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Login
            </Button>
            <Dialog open={forgotPasswordOpen} onClose={() => setForgotPasswordOpen(false)} >
              <DialogTitle>Forgot Password</DialogTitle>
              <DialogContent>
                <Typography sx={{marginBlockEnd:1}}>We will send your password via email</Typography>
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
          <Typography justifyContent={"center"}>Don't have an account?
            <Box
              component={Link}
              to="/register"
              sx={{
                textDecoration: 'none',
                color: 'inherit',
                '&:hover': {
                  color: '#1976d2',
                  cursor: 'pointer',
                },
              }}
            >
            Signup
            </Box>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};


export default Login;