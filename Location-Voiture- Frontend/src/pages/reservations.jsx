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
  const [originalReservations, setOriginalReservations] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");
  const client = JSON.parse(sessionStorage.getItem("client"));

  // Récupération des réservations depuis le serveur
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/reservation/all"
        );
        const clientReservations = response.data.filter(
          (reservation) => reservation.clientId?._id === client?.id
        );

        // Calcul des coûts totaux
        const updatedReservations = await Promise.all(
          clientReservations.map(async (reservation) => {
            const totalCost = await fetchTotalCost(reservation._id);
            return { ...reservation, total: totalCost };
          })
        );

        setOriginalReservations(updatedReservations);
        setReservations(updatedReservations);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des réservations :",
          error
        );
      }
    };

    if (client) fetchReservations();
  }, [client]);

  // Calculer le coût total d'une réservation
  const fetchTotalCost = async (reservationId) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/reservation/total/${reservationId}`
      );
      return response.data.total;
    } catch (error) {
      console.error("Erreur lors du calcul du coût total :", error);
      return 0;
    }
  };

  // Appliquer les filtres
  const applyFilters = () => {
    let filtered = [...originalReservations];

    if (statusFilter) {
      filtered = filtered.filter(
        (reservation) => reservation.statut === statusFilter
      );
    }

    if (startDateFilter) {
      filtered = filtered.filter(
        (reservation) =>
          new Date(reservation.dateDebut) >= new Date(startDateFilter)
      );
    }

    if (endDateFilter) {
      filtered = filtered.filter(
        (reservation) =>
          new Date(reservation.dateFin) <= new Date(endDateFilter)
      );
    }

    setReservations(filtered); // Fixer les réservations filtrées
  };

  // Annuler une réservation
  const handleCancelReservation = async (reservationId) => {
    try {
      await axios.put(
        `http://localhost:3000/reservation/cancel/${reservationId}`
      );
      const updatedReservations = originalReservations.map((reservation) =>
        reservation._id === reservationId
          ? { ...reservation, statut: "annulee" }
          : reservation
      );
      setOriginalReservations(updatedReservations);
      setReservations(updatedReservations);
      applyFilters(); // Réappliquer les filtres
      alert("Réservation annulée avec succès.");
    } catch (error) {
      console.error("Erreur lors de l'annulation de la réservation :", error);
      alert("Erreur lors de l'annulation.");
    }
  };

  // Effectuer un paiement et rediriger vers la page de paiement
  const handlePayment = async (reservation) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/paiement/effectuerPaiement",
        {
          reservationId: reservation._id,
          montant: reservation.total,
          methodePaiement: "en ligne",
        }
      );

      if (response.status === 201) {
        window.location.replace(`/paiment?reservationId=${reservation._id}`);
      } else {
        alert("Erreur lors du paiement.");
      }
    } catch (error) {
      console.error("Erreur lors du paiement :", error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom sx={{ color: "orange" }}>
        Vos Réservations
      </Typography>
      <Grid container spacing={3}>
        {/* Filtres */}
        <Grid item xs={12} sm={4}>
          <div
            style={{
              padding: "20px",
              backgroundColor: "#f5f5f5",
              borderRadius: "8px",
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ color: "orange" }}>
              Filtres
            </Typography>
            <FormControl fullWidth>
              <InputLabel>Statut</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Statut"
                sx={{ color: "gray" }}
              >
                <MenuItem value="">Tous</MenuItem>
                <MenuItem value="en cours">En cours</MenuItem>
                <MenuItem value="annulee">Annulée</MenuItem>
                <MenuItem value="terminee">Terminée</MenuItem>
                <MenuItem value="payée">Payée</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Date de début"
              type="date"
              fullWidth
              value={startDateFilter}
              onChange={(e) => setStartDateFilter(e.target.value)}
              InputLabelProps={{ shrink: true }}
              style={{ marginTop: "10px" }}
              sx={{ color: "gray" }}
            />
            <TextField
              label="Date de fin"
              type="date"
              fullWidth
              value={endDateFilter}
              onChange={(e) => setEndDateFilter(e.target.value)}
              InputLabelProps={{ shrink: true }}
              style={{ marginTop: "10px" }}
              sx={{ color: "gray" }}
            />
            <Button
              variant="contained"
              color="warning"
              onClick={applyFilters}
              style={{ marginTop: "20px" }}
            >
              Appliquer
            </Button>
          </div>
        </Grid>

        {/* Liste des réservations */}
        <Grid item xs={12} sm={8}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ backgroundColor: "gray" }}>
                <TableRow>
                  <TableCell sx={{ color: "orange" }}>Véhicule</TableCell>
                  <TableCell sx={{ color: "orange" }}>Date de début</TableCell>
                  <TableCell sx={{ color: "orange" }}>Date de fin</TableCell>
                  <TableCell sx={{ color: "orange" }}>Coût total</TableCell>
                  <TableCell sx={{ color: "orange" }}>Statut</TableCell>
                  <TableCell sx={{ color: "orange" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reservations.length > 0 ? (
                  reservations.map((reservation) => (
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
                          ? `${reservation.total} DT`
                          : "Non calculé"}
                      </TableCell>
                      <TableCell>{reservation.statut}</TableCell>
                      <TableCell>
                        {reservation.statut === "en cours" && (
                          <>
                            <Button
                              variant="outlined"
                              color="error"
                              onClick={() =>
                                handleCancelReservation(reservation._id)
                              }
                            >
                              Annuler
                            </Button>
                            <Button
                              variant="contained"
                              color="warning"
                              style={{ marginLeft: "10px" }}
                              onClick={() => handlePayment(reservation)}
                            >
                              Payer
                            </Button>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6}>
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
