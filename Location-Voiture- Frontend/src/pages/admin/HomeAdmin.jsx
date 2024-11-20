import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

const HomeAdmin = () => {
  const [vehicles, setVehicles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentVehicle, setCurrentVehicle] = useState({
    marque: "",
    modele: "",
    prixJournalier: "",
    images: [],
  });

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await axios.get("http://localhost:3000/vehicule/all");
      setVehicles(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des véhicules:", error);
    }
  };

  const handleOpenModal = (vehicle = null) => {
    setEditMode(!!vehicle);
    setCurrentVehicle(
      vehicle || { marque: "", modele: "", prixJournalier: "", images: [] }
    );
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentVehicle({
      marque: "",
      modele: "",
      prixJournalier: "",
      images: [],
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentVehicle((prev) => ({ ...prev, [name]: value }));
  };

  const saveVehicle = async () => {
    try {
      if (editMode) {
        await axios.put(
          `http://localhost:3000/vehicule/update/${currentVehicle._id}`,
          currentVehicle
        );
        alert("Véhicule mis à jour avec succès !");
      } else {
        await axios.post("http://localhost:3000/vehicule/add", currentVehicle);
        alert("Véhicule ajouté avec succès !");
      }
      fetchVehicles();
      handleCloseModal();
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du véhicule:", error);
      alert("Échec de l'enregistrement du véhicule.");
    }
  };

  const deleteVehicle = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce véhicule ?")) {
      try {
        await axios.delete(`http://localhost:3000/vehicule/delete/${id}`);
        alert("Véhicule supprimé avec succès !");
        fetchVehicles();
      } catch (error) {
        console.error("Erreur lors de la suppression du véhicule:", error);
        alert("Échec de la suppression du véhicule.");
      }
    }
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Gestion des véhicules
      </Typography>

      {/* Utilisation d'une Grid pour placer le bouton et la carte côte à côte */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {/* Colonne pour le bouton "Ajouter un véhicule" */}
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleOpenModal()}
          >
            Ajouter un véhicule
          </Button>
        </Grid>

        {/* Colonne pour la carte des véhicules */}
        <Grid item xs={12}>
          <Card sx={{ mt: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Liste des véhicules
              </Typography>
              <Grid container spacing={2}>
                {vehicles.map((vehicle) => (
                  <Grid item xs={12} sm={6} md={4} key={vehicle._id}>
                    <Box
                      sx={{
                        border: "1px solid #ccc",
                        borderRadius: 4,
                        padding: 2,
                        textAlign: "center",
                      }}
                    >
                      {/* Affichage des images */}
                      {vehicle.images.length > 0 && (
                        <img
                          src={vehicle.images[0]}
                          alt={`${vehicle.marque} ${vehicle.modele}`}
                          style={{
                            width: "100%",
                            maxHeight: "150px",
                            objectFit: "cover",
                            marginBottom: "10px",
                          }}
                        />
                      )}
                      <Typography variant="subtitle1">
                        {vehicle.marque} - {vehicle.modele}
                      </Typography>
                      <Typography variant="body2">
                        Prix journalier: {vehicle.prixJournalier} dt
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        <Button
                          variant="outlined"
                          color="primary"
                          sx={{ mr: 1 }}
                          onClick={() => handleOpenModal(vehicle)}
                        >
                          Modifier
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => deleteVehicle(vehicle._id)}
                        >
                          Supprimer
                        </Button>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog open={isModalOpen} onClose={handleCloseModal}>
        <DialogTitle>
          {editMode ? "Modifier le véhicule" : "Ajouter un véhicule"}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Marque"
            name="marque"
            fullWidth
            value={currentVehicle.marque}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Modèle"
            name="modele"
            fullWidth
            value={currentVehicle.modele}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Prix journalier"
            name="prixJournalier"
            type="number"
            fullWidth
            value={currentVehicle.prixJournalier}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Images (URL séparées par des virgules)"
            name="images"
            fullWidth
            value={currentVehicle.images.join(", ")}
            onChange={(e) =>
              setCurrentVehicle((prev) => ({
                ...prev,
                images: e.target.value.split(",").map((url) => url.trim()),
              }))
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="secondary">
            Annuler
          </Button>
          <Button onClick={saveVehicle} color="primary">
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default HomeAdmin;
