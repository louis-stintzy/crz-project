import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#526D5B",
    },
    secondary: {
      main: "#B78D75",
    },
    background: {
      default: "#F7F7F5",
      paper: "#FFFFFF",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 12,
  },
});
