import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");
  const client = JSON.parse(sessionStorage.getItem("client"));

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/reservation/all"
        );

        const clientReservations = response.data.filter(
          (reservation) =>
            reservation.clientId && reservation.clientId._id === client.id
        );

        setReservations(clientReservations);
        setFilteredReservations(clientReservations); // Initial set of filtered reservations
      } catch (error) {
        console.error("Error fetching reservations:", error);
      }
    };

    if (client) {
      fetchReservations();
    }
  }, [client]);

  // Fonction pour appliquer les filtres
  const applyFilters = () => {
    let filtered = [...reservations]; // Clone des réservations pour ne pas modifier l'état directement

    // Appliquer le filtre par statut
    if (statusFilter) {
      filtered = filtered.filter(
        (reservation) => reservation.statut === statusFilter
      );
    }

    // Appliquer le filtre par date de début
    if (startDateFilter) {
      filtered = filtered.filter(
        (reservation) =>
          new Date(reservation.dateDebut) >= new Date(startDateFilter)
      );
    }

    // Appliquer le filtre par date de fin
    if (endDateFilter) {
      filtered = filtered.filter(
        (reservation) =>
          new Date(reservation.dateFin) <= new Date(endDateFilter)
      );
    }

    // Mettre à jour l'état avec les réservations filtrées
    setFilteredReservations(filtered);
  };

  // Fonction pour annuler une réservation
  const handleCancelReservation = async (reservationId) => {
    try {
      await axios.put(
        `http://localhost:3000/reservation/cancel/${reservationId}`
      );

      // Mettre à jour les réservations locales
      const updatedReservations = reservations.map((reservation) =>
        reservation._id === reservationId
          ? { ...reservation, statut: "annulee" }
          : reservation
      );

      setReservations(updatedReservations);
      applyFilters(); // Appliquer les filtres après l'annulation

      alert("Réservation annulée avec succès");
    } catch (error) {
      console.error("Erreur lors de l'annulation de la réservation", error);
      alert("Erreur lors de l'annulation de la réservation");
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Vos Réservations
      </Typography>

      {/* Grid pour organiser les filtres et la liste des réservations */}
      <Grid container spacing={3}>
        {/* Colonne de filtres */}
        <Grid item xs={12} sm={4}>
          <div
            style={{
              padding: "20px",
              backgroundColor: "#f5f5f5",
              borderRadius: "8px",
            }}
          >
            <Typography variant="h6" gutterBottom>
              Filtres
            </Typography>
            <FormControl fullWidth>
              <InputLabel>Statut</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Statut"
              >
                <MenuItem value="">Tous</MenuItem>
                <MenuItem value="en cours">En Cours</MenuItem>
                <MenuItem value="annulee">Annulée</MenuItem>
                <MenuItem value="terminee">Terminée</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Date de Début"
              type="date"
              fullWidth
              value={startDateFilter}
              onChange={(e) => setStartDateFilter(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              style={{ marginTop: "10px" }}
            />
            <TextField
              label="Date de Fin"
              type="date"
              fullWidth
              value={endDateFilter}
              onChange={(e) => setEndDateFilter(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              style={{ marginTop: "10px" }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={applyFilters}
              style={{ marginTop: "20px" }}
            >
              Appliquer les Filtres
            </Button>
          </div>
        </Grid>

        {/* Colonne des réservations */}
        <Grid item xs={12} sm={8}>
          {/* Table des Réservations */}
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Véhicule</TableCell>
                  <TableCell>Date de Début</TableCell>
                  <TableCell>Date de Fin</TableCell>
                  <TableCell>Coût Total</TableCell>
                  <TableCell>Statut</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredReservations.length > 0 ? (
                  filteredReservations.map((reservation) => (
                    <TableRow key={reservation._id}>
                      <TableCell>
                        {reservation.vehiculeId
                          ? `${reservation.vehiculeId.marque} ${reservation.vehiculeId.modele}`
                          : "Aucun véhicule"}
                      </TableCell>
                      <TableCell>
                        {new Date(reservation.dateDebut).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {new Date(reservation.dateFin).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {reservation.total
                          ? `$${reservation.total}`
                          : "Non calculé"}
                      </TableCell>
                      <TableCell>{reservation.statut}</TableCell>
                      <TableCell>
                        {reservation.statut !== "annulee" && (
                          <Button
                            variant="contained"
                            color="secondary"
                            onClick={() =>
                              handleCancelReservation(reservation._id)
                            }
                          >
                            Annuler
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      Aucune réservation trouvée.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Reservations;
