import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  IconButton,
  Tooltip,
  AppBar,
  Toolbar,
  Fade,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import BookIcon from "@mui/icons-material/Book";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

const Layout = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [client, setClient] = useState(null); // État pour stocker les infos du client

  useEffect(() => {
    // Récupérer les informations du client depuis sessionStorage
    const clientData = JSON.parse(sessionStorage.getItem("client"));
    setClient(clientData);
  }, []);

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

  const menuItems = [
    { text: "Accueil", icon: <HomeIcon />, action: () => navigate("/home") },
    {
      text: "Mes Réservations",
      icon: <BookIcon />,
      action: () => navigate("/reservations"),
    },
    { text: "Profil", icon: <AccountCircleIcon />, action: () => {} },
    { text: "Déconnexion", icon: <ExitToAppIcon />, action: handleLogout },
  ];

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: "#1a1c20",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* Logo */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <img
              src="src/assets/images/logo.png"
              alt="Logo"
              style={{ height: "50px", marginRight: "15px" }}
            />
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", color: "#ffffff" }}
            >
              Rent Car
            </Typography>
          </Box>

          {/* Menu Button */}
          <Tooltip title="Menu" placement="bottom" arrow>
            <IconButton color="inherit" onClick={toggleSidebar(true)}>
              <MenuIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Drawer
        anchor="right"
        open={isSidebarOpen}
        onClose={toggleSidebar(false)}
        TransitionComponent={Fade}
        sx={{
          "& .MuiDrawer-paper": {
            width: 300,
            backgroundColor: "#1a1c20",
            color: "#e0e0e0",
          },
        }}
      >
        <Box
          sx={{
            width: 300,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            height: "100%",
            mt: 8,
          }}
          role="presentation"
          onClick={toggleSidebar(false)}
          onKeyDown={toggleSidebar(false)}
        >
          {/* Header */}
          <Box
            sx={{
              p: 3,
              textAlign: "center",
              backgroundColor: "#292c34",
              color: "#ffffff",
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              Bienvenue!
            </Typography>
            {client && (
              <Typography variant="subtitle1" sx={{ mt: 1 }}>
                {client.nom} {client.prenom}
              </Typography>
            )}
          </Box>
          <Divider sx={{ borderColor: "#42454d" }} />

          {/* Menu Items */}
          <List>
            {menuItems.map((item, index) => (
              <ListItem key={index} disablePadding>
                <Tooltip title={item.text} placement="left" arrow>
                  <ListItemButton
                    onClick={item.action}
                    sx={{ "&:hover": { backgroundColor: "#2a2d34" } }}
                  >
                    <ListItemIcon sx={{ color: "#ffb703" }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.text}
                      primaryTypographyProps={{
                        sx: { color: "#e0e0e0", fontWeight: "medium" },
                      }}
                    />
                  </ListItemButton>
                </Tooltip>
              </ListItem>
            ))}
          </List>
          <Divider sx={{ borderColor: "#42454d" }} />
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, mt: 8, p: 3, backgroundColor: "#f5f5f5" }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
