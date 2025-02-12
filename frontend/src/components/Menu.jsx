import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN } from "../constants";
import { Avatar, Button, Menubar } from "../ui";
import icon from "../assets/expense.ico";
function Menu() {
  const navigate = useNavigate();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const isLoggedIn = localStorage.getItem(ACCESS_TOKEN);

  if (!isLoggedIn) return null;

  const handleLogout = () => {
    localStorage.removeItem(ACCESS_TOKEN);
    navigate("/logout");
  };

  const menuItems = [
    { label: "Dashboard", icon: "pi pi-home", command: () => navigate("/") },
    { label: "Expenses", icon: "pi pi-user", command: () => navigate("/expenses") },
    { label: "Settings", icon: "pi pi-cog", command: () => navigate("/settings") },
  ];

  const start = (
    <Avatar image={icon} alt="Expense Tracker" size="large" />
  );

  const end = (
      <Button severity="danger" label="Logout" icon="pi pi-power-off" onClick={handleLogout} className="p-button-text" />
  );

  return (
    <Menubar model={menuItems} start={start} end={end} />
  );
}

export default Menu;
