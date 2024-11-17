import React, { useState } from "react";
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Box,
} from "@mui/material";

const SignupForm = () => {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    motDePasse: "",
    adresse: "",
    telephone: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logique pour envoyer les données au backend
    console.log(formData);
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#f4f4f9"
    >
      <Card sx={{ maxWidth: 400, padding: 3 }}>
        <CardContent>
          <Typography variant="h5" component="div" align="center" gutterBottom>
            Inscription Client
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Nom"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Prénom"
              name="prenom"
              value={formData.prenom}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Mot de passe"
              type="password"
              name="motDePasse"
              value={formData.motDePasse}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Adresse"
              name="adresse"
              value={formData.adresse}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Téléphone"
              name="telephone"
              value={formData.telephone}
              onChange={handleChange}
              margin="normal"
            />
            <Box mt={2}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                S'inscrire
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SignupForm;
