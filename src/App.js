import React from "react";
import "./App.css";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import createTheme from "@mui/material/styles/createTheme";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  primaryColor,
  secondaryColor,
  disabledButton,
  white,
  success,
  danger,
} from "./helpers/GlobalVariables";
import { useSelector } from "react-redux";
import { setAuthToken } from "./helpers/axios.js";
import { useRoutes } from "react-router-dom";
import routes from "./routes/routes";
import "@mobiscroll/react/dist/css/mobiscroll.react.css";
const theme = createTheme({
  palette: {
    primary: {
      main: primaryColor,
    },
    secondary: { main: secondaryColor },
    success: { main: success },
    danger: { main: danger },
    action: {
      disabledBackground: disabledButton,
      disabled: white,
    },
  },
  typography: {
    // fontFamily: [Neue].join(","),
    fontFamily: ["SF UI Text", "SF UI Display"].join(","),
  },

  MuiTypography: {
    defaultProps: {
      variantMapping: {
        h1: "h1",
        h2: "h2",
        h3: "h3",
        h4: "h4",
        h5: "h5",
        h6: "h6",
        subtitle1: "h2",
        subtitle2: "h2",
        body1: "span",
        body2: "span",
      },
    },
  },
});

function App() {
  const user = useSelector((state) => state.user);
  // Setting Auth Token In Axios Header
  setAuthToken(user.token);
  const routing = useRoutes(routes(user.currentUser));
  return <ThemeProvider theme={theme}>{routing}</ThemeProvider>;
}

export default App;
