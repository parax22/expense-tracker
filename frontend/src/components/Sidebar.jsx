import { useState } from "react";
import { Drawer, Avatar, Button, List, ListItem, ListItemText, Typography, IconButton } from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import { Box } from "@mui/system";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN } from "../constants";
import icon from "../assets/expense.ico";

function Sidebar() {
  const navigate = useNavigate();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const isLoggedIn = localStorage.getItem(ACCESS_TOKEN);

  if (!isLoggedIn) return null;

  const handleLogout = () => {
    navigate("/logout");
  };

  const toggleDrawer = () => {
    setDrawerVisible(!drawerVisible);
  };

  const drawerContent = (
    <Box display="flex" flexDirection="column" alignItems="center" sx={{ height: "100%", p: 2 }}>
      <Avatar src={icon} sx={{ width: 60, height: 60, mb: 2, border: "2px solid white" }} />
      <Typography variant="h6" sx={{ mb: 4 }}>Expense Tracker</Typography>
      <List sx={{ flexGrow: 1 }}>
        <ListItem button="true" onClick={() => navigate("/")} sx={{ px: 10, "&:hover, &:focus, &:active": { bgcolor: "action.hover" } }}>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button="true" onClick={() => navigate("/expenses")} sx={{ px: 10, "&:hover, &:focus, &:active": { bgcolor: "action.hover" } }}>
          <ListItemText primary="Expenses" />
        </ListItem>
        <ListItem button="true" onClick={() => navigate("/settings")} sx={{ px: 10, "&:hover, &:focus, &:active": { bgcolor: "action.hover" } }}>
          <ListItemText primary="Settings" />
        </ListItem>
      </List>
      <Box sx={{ mt: "auto", p: 5 }}>
        <Button variant="contained" color="error" onClick={handleLogout} sx={{ width: "100%", textTransform: "none", px: 5 }}>
          Logout
        </Button>
      </Box>
    </Box>
  );

  return (
    <>
      <IconButton
        onClick={toggleDrawer}
        sx={{ display: { xs: "block", md: "none" }, position: "absolute", top: 10, left: 10 }}
      >
        <MenuIcon />
      </IconButton>

      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          width: 240,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: 240, boxSizing: "border-box" }
        }}
      >
        {drawerContent}
      </Drawer>

      <Drawer variant="temporary" open={drawerVisible} onClose={toggleDrawer} sx={{ display: { xs: "block", md: "none" } }}>
        {drawerContent}
      </Drawer>
    </>
  );
}

export default Sidebar;
