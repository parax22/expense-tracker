import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import Toolbar from "./components/Toolbar";
import { createTheme, colors, ThemeProvider } from "@mui/material";

function Logout() {
  localStorage.clear();
  return <Navigate to="/login" />
}

function RegisterAndLogout() {
  localStorage.clear();
  return <Register />
}

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: colors.green,
  }
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <BrowserRouter>
        <Toolbar/>
        <Routes>
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/register" element={<RegisterAndLogout />} />
          <Route path="*" element={<NotFound />} />  
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App;
