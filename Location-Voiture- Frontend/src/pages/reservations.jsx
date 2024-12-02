import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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
  CircularProgress,
} from "@mui/material";

const Reservations = () => {
  const navigate = useNavigate();
  const [originalReservations, setOriginalReservations] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");
  const client = JSON.parse(sessionStorage.getItem("client")) || {};
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleStatusFilterChange = (e) => setStatusFilter(e.target.value);
  const handleStartDateFilterChange = (e) => setStartDateFilter(e.target.value);
  const handleEndDateFilterChange = (e) => setEndDateFilter(e.target.value);

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
        setError("Erreur lors de la récupération des réservations.");
      } finally {
        setLoading(false);
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
      return response.data?.total || 0;
    } catch (error) {
      console.error("Erreur lors du calcul du coût total :", error);
      return 0;
    }
  };

  const applyFilters = () => {
    let filteredReservations = [...originalReservations];

    // Filtrer par statut
    if (statusFilter) {
      filteredReservations = filteredReservations.filter(
        (reservation) => reservation.statut === statusFilter
      );
    }

    // Filtrer par date de début
    if (startDateFilter) {
      filteredReservations = filteredReservations.filter((reservation) => {
        const startDate = new Date(reservation.dateDebut).setHours(0, 0, 0, 0);
        const filterStartDate = new Date(startDateFilter).setHours(0, 0, 0, 0);
        return startDate >= filterStartDate;
      });
    }

    // Filtrer par date de fin
    if (endDateFilter) {
      filteredReservations = filteredReservations.filter((reservation) => {
        const endDate = new Date(reservation.dateFin).setHours(0, 0, 0, 0);
        const filterEndDate = new Date(endDateFilter).setHours(0, 0, 0, 0);
        return endDate <= filterEndDate;
      });
    }

    setReservations(filteredReservations);
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
      applyFilters();
      alert("Réservation annulée avec succès.");
    } catch (error) {
      console.error("Erreur lors de l'annulation de la réservation :", error);
      alert("Erreur lors de l'annulation.");
    }
  };

  // Effectuer un paiement et rediriger vers la page de paiement
  const handlePayment = (reservationId, total) => {
    navigate("/paiment", { state: { reservationId, total } });
  };

  // Gestion des états de chargement et d'erreur
  if (loading) {
    return (
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress sx={{ color: "orange" }} />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom sx={{ color: "orange" }}>
        Vos Réservations
      </Typography>
      <Grid container spacing={3}>
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
                onChange={handleStatusFilterChange}
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
              onChange={handleStartDateFilterChange}
              InputLabelProps={{ shrink: true }}
              style={{ marginTop: "10px" }}
              sx={{ color: "gray" }}
            />
            <TextField
              label="Date de fin"
              type="date"
              fullWidth
              value={endDateFilter}
              onChange={handleEndDateFilterChange}
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
                          ? `${reservation.vehiculeId.marque || "Inconnu"} ${
                              reservation.vehiculeId.modele || "Inconnu"
                            }`
                          : "Aucun véhicule"}
                      </TableCell>
                      <TableCell>
                        {reservation.dateDebut
                          ? new Date(reservation.dateDebut).toLocaleDateString()
                          : "Non défini"}
                      </TableCell>
                      <TableCell>
                        {reservation.dateFin
                          ? new Date(reservation.dateFin).toLocaleDateString()
                          : "Non défini"}
                      </TableCell>
                      <TableCell>
                        {reservation.total
                          ? `${reservation.total} DT`
                          : "Non calculé"}
                      </TableCell>
                      <TableCell>
                        {reservation.statut || "Non défini"}
                      </TableCell>
                      <TableCell>
                        {reservation.statut === "en cours" && (
                          <Grid container spacing={2}>
                            <Grid item>
                              <Button
                                variant="contained"
                                color="warning"
                                onClick={() =>
                                  handlePayment(
                                    reservation._id,
                                    reservation.total
                                  )
                                }
                              >
                                Payer
                              </Button>
                            </Grid>
                            <Grid item>
                              <Button
                                variant="outlined"
                                color="error"
                                onClick={() =>
                                  handleCancelReservation(reservation._id)
                                }
                              >
                                Annuler
                              </Button>
                            </Grid>
                          </Grid>
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
