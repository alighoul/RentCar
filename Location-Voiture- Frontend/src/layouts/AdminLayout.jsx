// src/layouts/AdminLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import Sidebar from "../pages/SideBar/AdminSideBar";

const AdminLayout = () => {
  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar fixe */}
      <Sidebar />
      {/* Contenu principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          backgroundColor: "#f9f9f9",
          minHeight: "100vh",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;
