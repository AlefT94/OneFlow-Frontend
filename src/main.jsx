import React from "react";
import ReactDOM from "react-dom/client";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { App } from "./App/App"; // ajuste o caminho se for ./app/App
import "./styles/globals.css";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#2563eb", // azul de referência
    },
    background: {
      default: "#f3f4f6",
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);