import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Box,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import BookIcon from "@mui/icons-material/Book";
import GroupIcon from "@mui/icons-material/Group";
import DescriptionIcon from "@mui/icons-material/Description";
import AssessmentIcon from "@mui/icons-material/Assessment";
import LogoutIcon from "@mui/icons-material/Logout";

const Sidebar = () => {
  const location = useLocation();
  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/admin/" },
    {
      text: "Gérer les Véhicules",
      icon: <DirectionsCarIcon />,
      path: "/admin/home",
    },
    {
      text: "Gérer les Réservations",
      icon: <BookIcon />,
      path: "/admin/reservation",
    },
    { text: "Gérer les Clients", icon: <GroupIcon />, path: "/admin/clients" },
    {
      text: "Gérer les Contrats",
      icon: <DescriptionIcon />,
      path: "/admin/contrats",
    },
    { text: "Rapports", icon: <AssessmentIcon />, path: "/admin/reports" },
    { text: "Déconnexion", icon: <LogoutIcon />, path: "/logout" },
  ];

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: 260,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 260,
          boxSizing: "border-box",
          backgroundColor: "#f4f4f9",
          color: "#4a4a4a",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: 80,
          backgroundColor: "#ffffff",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            color: "#4a4a4a",
            textTransform: "uppercase",
          }}
        >
          Admin Panel
        </Typography>
      </Box>
      <Divider sx={{ borderColor: "#e0e0e0" }} />
      <List>
        {menuItems.map((item) => (
          <ListItem
            key={item.text}
            component={Link}
            to={item.path}
            sx={{
              backgroundColor:
                location.pathname === item.path ? "#e8f0fe" : "transparent",
              "&:hover": { backgroundColor: "#e8f5e9" },
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
