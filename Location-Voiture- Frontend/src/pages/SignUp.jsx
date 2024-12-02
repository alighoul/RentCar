import React, { useState } from "react";
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Box,
  Avatar,
} from "@mui/material";
import { Link } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import HomeIcon from "@mui/icons-material/Home";
import PhoneIcon from "@mui/icons-material/Phone";
import { styled } from "@mui/system";

// Styled components for icons
const IconWrapper = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "8px",
});

// Custom styles for the Card
const StyledCard = styled(Card)({
  maxWidth: 400,
  padding: "20px",
  borderRadius: "12px",
  backgroundColor: "#ffffff",
  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
});

// Custom styles for the Button
const StyledButton = styled(Button)({
  backgroundColor: "orange",
  color: "#fff",
  "&:hover": {
    backgroundColor: "#cc7700",
  },
});

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/client/addclient", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Inscription réussie :", data);
        alert("Inscription réussie !");
        setFormData({
          nom: "",
          prenom: "",
          email: "",
          motDePasse: "",
          adresse: "",
          telephone: "",
        }); // Reset the form
      } else {
        const errorData = await response.json();
        console.error("Erreur lors de l'inscription :", errorData.message);
        alert(`Erreur : ${errorData.message}`);
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
      alert("Erreur réseau. Veuillez réessayer plus tard.");
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#f4f4f9"
    >
      <StyledCard>
        <CardContent>
          <Box display="flex" justifyContent="center" mb={2}>
            <Avatar
              src="https://example.com/logo.png" // Remplacez par l'URL de votre logo
              alt="Logo"
              sx={{ width: 64, height: 64 }}
            />
          </Box>
          <Typography
            variant="h5"
            component="div"
            align="center"
            gutterBottom
            fontWeight="bold"
            color="text.secondary"
          >
            Inscription Client
          </Typography>
          <form onSubmit={handleSubmit}>
            <IconWrapper>
              <PersonIcon sx={{ color: "gray" }} />
              <TextField
                fullWidth
                label="Nom"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                margin="normal"
                required
              />
            </IconWrapper>
            <IconWrapper>
              <PersonIcon sx={{ color: "gray" }} />
              <TextField
                fullWidth
                label="Prénom"
                name="prenom"
                value={formData.prenom}
                onChange={handleChange}
                margin="normal"
                required
              />
            </IconWrapper>
            <IconWrapper>
              <EmailIcon sx={{ color: "gray" }} />
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
            </IconWrapper>
            <IconWrapper>
              <LockIcon sx={{ color: "gray" }} />
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
            </IconWrapper>
            <IconWrapper>
              <HomeIcon sx={{ color: "gray" }} />
              <TextField
                fullWidth
                label="Adresse"
                name="adresse"
                value={formData.adresse}
                onChange={handleChange}
                margin="normal"
              />
            </IconWrapper>
            <IconWrapper>
              <PhoneIcon sx={{ color: "gray" }} />
              <TextField
                fullWidth
                label="Téléphone"
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
                margin="normal"
              />
            </IconWrapper>
            <Box mt={2}>
              <StyledButton
                type="submit"
                variant="contained"
                fullWidth
                size="large"
              >
                S'inscrire
              </StyledButton>
            </Box>
          </form>
          <Box mt={2} textAlign="center">
            <Typography variant="body2" color="text.secondary">
              Vous avez déjà un compte ?{" "}
              <Link to="/login" style={{ color: "orange", fontWeight: "bold" }}>
                Connectez-vous
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </StyledCard>
    </Box>
  );
};

export default SignupForm;
