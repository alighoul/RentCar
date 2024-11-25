import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  IconButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import BookIcon from "@mui/icons-material/Book";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

const Layout = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setIsSidebarOpen(open);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("client");
    navigate("/login");
  };

  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar Drawer */}
      <Drawer
        anchor="right"
        open={isSidebarOpen}
        onClose={toggleSidebar(false)}
      >
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleSidebar(false)}
          onKeyDown={toggleSidebar(false)}
        >
          <Typography variant="h5" sx={{ p: 2, textAlign: "center" }}>
            Menu
          </Typography>
          <Divider />
          <List>
            <ListItem button onClick={() => navigate("/home")}>
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Accueil" />
            </ListItem>
            <ListItem button onClick={() => navigate("/reservations")}>
              <ListItemIcon>
                <BookIcon />
              </ListItemIcon>
              <ListItemText primary="Mes Réservations" />
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                <AccountCircleIcon />
              </ListItemIcon>
              <ListItemText primary="Profil" />
            </ListItem>
            <ListItem button onClick={handleLogout}>
              <ListItemIcon>
                <ExitToAppIcon />
              </ListItemIcon>
              <ListItemText primary="Déconnexion" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1 }}>
        {/* Top Header with Menu Button */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between", // Répartir l'espace entre l'image et les autres éléments
            alignItems: "center",
            p: 2,
            backgroundColor: "#f5f5f5",
            borderBottom: "1px solid #ddd",
          }}
        >
          {/* Logo à gauche */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <img
              src="src/assets/images/logo.png"
              alt="Logo"
              style={{ height: "70px", marginRight: "10px" }}
            />
            <Typography variant="h6">Rent Car</Typography>
          </Box>

          {/* Bouton du menu à droite */}
          <IconButton onClick={toggleSidebar(true)}>
            <MenuIcon />
          </IconButton>
        </Box>

        {/* Page Content */}
        <Box sx={{ p: 3 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
