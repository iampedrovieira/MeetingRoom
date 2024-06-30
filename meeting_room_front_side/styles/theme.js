import { createMuiTheme } from '@material-ui/core/styles';

// Create a theme instance.
const theme = createMuiTheme({
  palette: {
    type: 'light',
    primary: {
      main: '#192A49',
    },
    secondary: {
      main: '#457AB2',
    },
    background: {
      default: '#E5E5E5',
    },
  },
  typography: {
    fontFamily: 'Montserrat',
    body1: {
      fontFamily: 'Roboto',
    },
    body2: {
      fontFamily: 'Roboto',
    },
    button: {
      fontFamily: 'Montserrat',
    },
  },
});

export default theme;