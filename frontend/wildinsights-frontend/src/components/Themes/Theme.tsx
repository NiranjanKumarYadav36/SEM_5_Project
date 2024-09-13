import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4CAF50',  // Green shade
    },
    background: {
      default: '#FFFFFF',  // White background
    },
    text: {
      primary: '#000000',  // Black text color
    },
  },
  typography: {
    fontFamily: 'Public Sans, Arial, sans-serif',  // Set Public Sans as default font
  },
  shape: {
    borderRadius: 20,  // Rounded corners for buttons and other elements
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '50px',  // Specifically more rounded buttons
          padding: '10px 20px',  // Button padding
          fontFamily: 'Public Sans, Arial, sans-serif', // Set Public Sans as default font
        },
        contained: {
          backgroundColor: '#4CAF50',  // Green background
          color: '#FFFFFF',  // White text
          '&:hover': {
            backgroundColor: '#388E3C',  // Darker green on hover
          },
        },
      },
    },
  },
});

export default theme;