import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import { TextField, Button, Container, Typography, Grid } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

const GenerateContract = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    clientName,
    vehicleModel,
    startDate,
    endDate,
    mileage,
    fuelLevel,
    licensePlate,
    vehicleBrand,
  } = location.state || {};

  const [client, setClientName] = useState(clientName || "");
  const [vehicle, setVehicleModel] = useState(vehicleModel || "");
  const [start, setStartDate] = useState(startDate || "");
  const [end, setEndDate] = useState(endDate || "");
  const [vehicleMileage, setVehicleMileage] = useState(mileage || "");
  const [fuel, setFuelLevel] = useState(fuelLevel || "");
  const [matricule, setMatricule] = useState(licensePlate || "");
  const [brand, setBrand] = useState(vehicleBrand || "");

  useEffect(() => {
    if (location.state) {
      setClientName(location.state.clientName);
      setVehicleModel(location.state.vehicleModel);
      setStartDate(location.state.startDate);
      setEndDate(location.state.endDate);
      setVehicleMileage(location.state.mileage);
      setFuelLevel(location.state.fuelLevel);
      setMatricule(location.state.licensePlate);
      setBrand(location.state.vehicleBrand);
    }
  }, [location]);

  const handleGenerateContract = () => {
    const doc = new jsPDF();
    const logo = "src/assets/images/small.png";

    // Placer l'image dans le coin supérieur gauche
    doc.addImage(logo, "JPEG", 10, 10, 30, 30); // x=10, y=10, largeur=30, hauteur=30

    // Ajouter le titre
    doc.setFontSize(20);
    doc.text("Contrat de Location", 50, 25); // Ajuster x pour centrer le texte après le logo
    doc.setLineWidth(0.5);
    doc.line(10, 40, 200, 40); // Ligne sous le titre

    // Ajouter les détails du contrat
    doc.setFontSize(12);
    doc.text(`Nom du Client: ${client}`, 20, 50);
    doc.text(`Marque du Véhicule: ${brand}`, 20, 60);
    doc.text(`Modèle de Véhicule: ${vehicle}`, 20, 70);
    doc.text(`Date de Début: ${start}`, 20, 80);
    doc.text(`Date de Fin: ${end}`, 20, 90);
    doc.text(`Kilométrage du Véhicule: ${vehicleMileage} km`, 20, 100);
    doc.text(`Niveau de Carburant: ${fuel}%`, 20, 110);
    doc.text(`Matricule: ${matricule}`, 20, 120);

    // Ajouter les conditions générales
    doc.setFillColor(240, 240, 240);
    doc.rect(15, 140, 180, 50, "F");
    doc.setFontSize(10);
    doc.text(
      "Conditions Générales :\n1. Le véhicule doit être retourné dans l'état dans lequel il a été pris.\n2. Le client est responsable du véhicule durant toute la période de location.",
      20,
      155
    );

    // Ajouter un carré pour la signature
    doc.setFontSize(12);
    doc.text("Signature du Client :", 20, 210); 
    doc.rect(60, 200, 120, 30); 

    // Sauvegarder le PDF
    doc.save("contrat-location.pdf");

    // Rediriger après la génération
    navigate("/admin/reservation");
  };

  return (
    <Container>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          color: "orange",
          textAlign: "center",
          marginBottom: "20px",
        }}
      >
        Générer un Contrat de Location
      </Typography>
      <form>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Nom du Client"
              variant="outlined"
              fullWidth
              value={client}
              disabled
              sx={{ backgroundColor: "#f5f5f5" }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Marque du Véhicule"
              variant="outlined"
              fullWidth
              value={brand}
              disabled
              sx={{ backgroundColor: "#f5f5f5" }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Modèle du Véhicule"
              variant="outlined"
              fullWidth
              value={vehicle}
              disabled
              sx={{ backgroundColor: "#f5f5f5" }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Date de Début"
              type="date"
              variant="outlined"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              value={start}
              disabled
              sx={{ backgroundColor: "#f5f5f5" }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Date de Fin"
              type="date"
              variant="outlined"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              value={end}
              disabled
              sx={{ backgroundColor: "#f5f5f5" }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Kilométrage du Véhicule"
              variant="outlined"
              fullWidth
              value={vehicleMileage}
              onChange={(e) => setVehicleMileage(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Niveau de Carburant (%)"
              variant="outlined"
              fullWidth
              value={fuel}
              onChange={(e) => setFuelLevel(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Matricule"
              variant="outlined"
              fullWidth
              value={matricule}
              onChange={(e) => setMatricule(e.target.value)}
            />
          </Grid>
        </Grid>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "orange",
            color: "white",
            marginTop: "20px",
            "&:hover": {
              backgroundColor: "darkorange",
            },
          }}
          onClick={handleGenerateContract}
        >
          Générer le Contrat
        </Button>
      </form>
    </Container>
  );
};

export default GenerateContract;
