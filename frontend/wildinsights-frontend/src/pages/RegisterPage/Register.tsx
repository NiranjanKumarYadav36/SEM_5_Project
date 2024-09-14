import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Container,Paper,Box,Typography,TextField,InputAdornment,Button,IconButton} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import HttpsIcon from '@mui/icons-material/Https';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordVisible2, setPasswordVisible2] = useState(false);
  const [loading, setLoading] = useState(false);  // To manage loading state
  const [error, setError] = useState('');  // To manage error messages
  // const [usernameError, setUsernameError] = useState('')

  // const checkUsernameAvailability = async (username: String) => {
  //   try {
  //     const response = await axios.get(`http://localhost:8000/api/check-username/`, {
  //       params: { username }
  //     });
  //     return response.data.available;
  //   } catch (error) {
  //     console.error('Error checking username availability:', error);
  //     return false;
  //   }
  // };

  const handleRegister = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Basic front-end validation
    // if (!username || !email || !password || !password2) {
    //   setError("All fields are required.");
    //   setLoading(false);
    //   return;
    // }
    // if (username.length < 4) {
    //   setError("Username must be at least 4 characters long.")
    //   setLoading(false);
    //   return
    // }
    if (password !== password2) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }
    // if (password.length < 6) {
    //   setError("Password must be at least 8 characters long.");
    //   setLoading(false);
    //   return;
    // }
    // if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    //   setError("Invalid email format.");
    //   setLoading(false);
    //   return;
    // }

    // Check username availability
    // const isUsernameAvailable = await checkUsernameAvailability(username);
    // if (!isUsernameAvailable) {
    //   setUsernameError("Username already exists. Please choose a different one.");
    //   setLoading(false);
    //   return;
    // }


    try {
      await axios.post('http://localhost:8000/api/register', { 
        username,
        email,
        password,
        password2
      }, {
        headers: { 'Content-Type': 'application/json' },  
        withCredentials: true  
      });
      alert('Registration successful');
      // Reset form after successful registration
      setUsername('');
      setEmail('');
      setPassword('');
      setPassword2('');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.response) {
        console.log(error);

        const errorData = error.response.data;
        let errorMessage = '';

        if (errorData.username) {
          errorMessage += `Username: ${errorData.username[0]} `;
        }
        if (errorData.email) {
          errorMessage += `Email: ${errorData.email[0]} `;
        }
        if (errorData.password) {
          errorMessage += `Password: ${errorData.password[0]} `;
        }

        if (!errorMessage){
          errorMessage= `Registration failed: ${error.response.data.detail || error.message}`;
        }
        setError(errorMessage);
        
      } else if (error.request) {
        console.log(error)
        // Request was made but no response received
        setError('Server did not respond. Please try again later.');
      } else {
        console.log(error)
        // Something else caused the error
        setError(`An error occurred: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const togglePasswordVisibility2 = () => {
    setPasswordVisible2(!passwordVisible2);
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
          Signup
        </Typography>
        <Box component="form" onSubmit={handleRegister} noValidate sx={{ mt: 1 }}>
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
                  <EmailIcon />
                </InputAdornment>
              ),
            }}
            id="Email"
            label="Email"
            name="Email"
            autoComplete="Email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
                   <IconButton onClick={togglePasswordVisibility2}>
                    {passwordVisible2 ? <VisibilityIcon /> :  <VisibilityOffIcon /> }
                  </IconButton>
                </InputAdornment>
              )
            }}
            name="password"
            label="Confirm-Password"
            type={passwordVisible2 ? 'text' : 'password'}
            id="password2"
            autoComplete="current-password"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{ mt: 3, mb: 2 }}
          >
            {loading ? 'Registering...' : 'Register'}
          </Button>
        </Box>
        {error && <Typography color="error">{error}</Typography>}
        <Typography justifyContent={"center"}>Aldready have an account?
            <Box
              component={Link}
              to="/login"
              sx={{
                textDecoration: 'none',
                color: 'inherit',
                '&:hover': {
                  color: '#1976d2',
                  cursor: 'pointer',
                },
              }}
            >
            Login
            </Box>
        </Typography>
      </Box>
    </Paper>
  </Container>
  );
};

export default Register;