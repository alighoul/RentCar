import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  TextField,
  Button,
  Typography,
  Box,
  Container,
  Alert,
  Avatar,
  CssBaseline,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

const Login = () => {
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/client/login", {
        email,
        motDePasse,
      });

      // Save client info to session storage
      sessionStorage.setItem("client", JSON.stringify(response.data.client));
      navigate("/home"); // Redirect to Home after successful login
    } catch (error) {
      setError(
        "Login failed: " + (error.response?.data?.message || error.message)
      );
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Logo */}
        <Avatar sx={{ m: 1, bgcolor: "orange" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5" color="text.primary">
          Connexion
        </Typography>
        {/* Login Form */}
        <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Adresse Email"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputLabelProps={{
              style: { color: "orange" },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: "orange",
                },
              },
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Mot de Passe"
            type="password"
            id="password"
            autoComplete="current-password"
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
            InputLabelProps={{
              style: { color: "orange" },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: "orange",
                },
              },
            }}
          />
          {error && <Alert severity="error">{error}</Alert>}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              mb: 2,
              bgcolor: "orange",
              "&:hover": { bgcolor: "darkorange" },
            }}
          >
            Se Connecter
          </Button>
          {/* Signup Link */}
          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Pas encore de compte ?{" "}
            <Link
              to="/signup"
              style={{
                textDecoration: "none",
                color: "orange",
                fontWeight: "bold",
              }}
            >
              Inscrivez-vous ici
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
