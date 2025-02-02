import { AppBar, Avatar, Button } from "@mui/material";
import { Box } from "@mui/system";
import { Typography } from "@mui/material";
import icon from "../assets/expense.ico";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN } from "../constants";

function Toolbar() {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem(ACCESS_TOKEN);

  const handleLogout = () => {
    navigate("/logout");
  };

  return (
    <AppBar position="static" sx={{ p: 2 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box display="flex" alignItems="center">
          <Avatar src={icon} sx={{ width: 40, height: 40, mr: 2, border: "2px solid white" }} />
          <Typography variant="h6">Expense tracker</Typography>
        </Box>
        {isLoggedIn && (
          <Button 
            variant="contained" 
            color="secondary" 
            onClick={ handleLogout }
            sx={{ textTransform: "none" }}
          >
            Logout
          </Button>
        )}
      </Box>
    </AppBar>
  );
}

export default Toolbar;