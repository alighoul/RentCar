import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Box,
  Collapse,
  Tooltip,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import {
  Dashboard as DashboardIcon,
  DirectionsCar as DirectionsCarIcon,
  Book as BookIcon,
  Group as GroupIcon,
  Description as DescriptionIcon,
  Assessment as AssessmentIcon,
  Logout as LogoutIcon,
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";

const Sidebar = () => {
  const location = useLocation();

  // Menu items with submenus for enhanced navigation
  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/admin/" },
    {
      text: "Gestion",
      icon: <DirectionsCarIcon />,
      children: [
        { text: "Véhicules", path: "/admin/home" },
        { text: "Réservations", path: "/admin/reservation" },
        { text: "Clients", path: "/admin/clients" },
      ],
    },
    {
      text: "Contrats",
      icon: <DescriptionIcon />,
      path: "/admin/contrats",
    },
    { text: "Rapports", icon: <AssessmentIcon />, path: "/admin/reports" },
    { text: "Déconnexion", icon: <LogoutIcon />, path: "/logout" },
  ];

  // State for handling submenu toggling
  const [openMenus, setOpenMenus] = React.useState({});

  const handleToggleMenu = (menu) => {
    setOpenMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: 300,
        "& .MuiDrawer-paper": {
          width: 300,
          boxSizing: "border-box",
          backgroundColor: "#1a1c20",
          color: "#e0e0e0",
          borderRight: "1px solid #292c34",
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: 100,
          backgroundColor: "#292c34",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            color: "#ffffff",
            textTransform: "uppercase",
          }}
        >
          Admin Panel
        </Typography>
      </Box>
      <Divider sx={{ borderColor: "#42454d" }} />

      {/* Menu */}
      <List>
        {menuItems.map((item, index) =>
          item.children ? (
            <Box key={index}>
              {/* Parent Menu with Submenus */}
              <Tooltip title={item.text} placement="right" arrow>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => handleToggleMenu(item.text)}
                    sx={{
                      "&:hover": { backgroundColor: "#2a2d34" },
                      color: openMenus[item.text] ? "#ffb703" : "#e0e0e0",
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        color: openMenus[item.text] ? "#ffb703" : "#e0e0e0",
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.text} />
                    {openMenus[item.text] ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                </ListItem>
              </Tooltip>

              {/* Submenu Items */}
              <Collapse in={openMenus[item.text]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.children.map((child, idx) => (
                    <Tooltip
                      title={child.text}
                      placement="right"
                      arrow
                      key={idx}
                    >
                      <ListItem disablePadding>
                        <ListItemButton
                          component={Link}
                          to={child.path}
                          sx={{
                            pl: 4,
                            "&:hover": { backgroundColor: "#34373f" },
                            backgroundColor:
                              location.pathname === child.path
                                ? "#2a2d34"
                                : "transparent",
                            color:
                              location.pathname === child.path
                                ? "#ffb703"
                                : "#e0e0e0",
                          }}
                        >
                          <ListItemText primary={child.text} />
                        </ListItemButton>
                      </ListItem>
                    </Tooltip>
                  ))}
                </List>
              </Collapse>
            </Box>
          ) : (
            <Tooltip title={item.text} placement="right" arrow key={index}>
              {/* Single Menu Item */}
              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  sx={{
                    "&:hover": { backgroundColor: "#2a2d34" },
                    backgroundColor:
                      location.pathname === item.path
                        ? "#2a2d34"
                        : "transparent",
                    color:
                      location.pathname === item.path ? "#ffb703" : "#e0e0e0",
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color:
                        location.pathname === item.path ? "#ffb703" : "#e0e0e0",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            </Tooltip>
          )
        )}
      </List>
    </Drawer>
  );
};

export default Sidebar;
