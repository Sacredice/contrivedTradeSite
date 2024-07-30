import { createTheme } from '@mui/material/styles';
import { blue, orange } from '@mui/material/colors';

const mode = "light";

export const theme = createTheme({
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 1536,
      },
    },
    palette: {
      mode,
      primary: blue,
      // secondary: {
      //   light: '#b26500',
      //   main: '#ff9100',
      //   dark: '#ffa733',
      //   contrastText: '#000',
      // },
      secondary: orange
    },
  });
