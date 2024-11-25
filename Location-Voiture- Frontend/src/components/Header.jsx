import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 20px",
        backgroundColor: "#f8f9fa",
        borderBottom: "1px solid #ddd",
      }}
    >
      <img
        src="/assets/images/logo.png"
        alt="Logo"
        style={{ height: "50px" }}
      />
      <nav>
        <Link to="/home" style={{ margin: "0 10px" }}>
          Home
        </Link>
        <Link to="/reservations" style={{ margin: "0 10px" }}>
          Reservations
        </Link>
        <Link to="/admin/home" style={{ margin: "0 10px" }}>
          Admin
        </Link>
      </nav>
    </header>
  );
};

export default Header;
