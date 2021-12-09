import { ThemeOptions } from '@material-ui/core/styles/createMuiTheme';

export const themeOptions: ThemeOptions = {
  palette: {
    type: 'light',
    primary: {
      main: '#5C2DB5',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#819595',
      contrastText: 'rgba(255,255,255,0.87)',
    },
    background: {
      default: '#F6F6F6',
      paper: '#fffffa',
    },
    text: {
      primary: '#2e2727',
      secondary: '#2e2727',
      disabled: 'rgba(46,39,39,0.48)',
      hint: '#2e2727',
    },
    error: {
      main: '#F8333C',
    },
    warning: {
      main: '#fcab10',
    },
    info: {
      main: '#72ccfe',
    },
    success: {
      main: '#00BE82',
    },
  },
};
