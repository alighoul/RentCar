import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const AllReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchReservations = async () => {
    try {
      const response = await axios.get("http://localhost:3000/reservation/all");
      const sortedReservations = response.data.sort(
        (a, b) => new Date(a.dateDebut) - new Date(b.dateDebut)
      );

      setReservations(sortedReservations);
      setLoading(false);
    } catch (error) {
      setError("Erreur lors de la récupération des réservations");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleGenerateContract = (reservation) => {
    navigate("/contrat", {
      state: {
        clientName: `${reservation.clientId.nom} ${reservation.clientId.prenom}`,
        vehicleBrand: reservation.vehiculeId.marque,
        vehicleModel: reservation.vehiculeId.modele,
        startDate: reservation.dateDebut,
        endDate: reservation.dateFin,
        mileage: reservation.vehiculeId.kilometrage,
        fuelLevel: reservation.vehiculeId.niveauCarburant,
        licensePlate: reservation.vehiculeId.matricule,
      },
    });
  };

  if (loading) {
    return (
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh", // Pour centrer verticalement
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
      <Typography
        variant="h4"
        gutterBottom
        sx={{ color: "#e2462a", textAlign: "center" }}
      >
        Liste des Réservations
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: "#e2462a",
              }}
            >
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Client
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Véhicule
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Marque
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Date de Début
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Date de Fin
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Statut
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reservations.map((reservation) => (
              <TableRow
                key={reservation._id}
                sx={{
                  backgroundColor: "#f5f5f5",
                  "&:hover": {
                    backgroundColor: "#e0e0e0",
                  },
                }}
              >
                <TableCell>
                  {reservation.clientId.nom} {reservation.clientId.prenom}
                </TableCell>
                <TableCell>{reservation.vehiculeId.modele}</TableCell>
                <TableCell>{reservation.vehiculeId.marque}</TableCell>
                <TableCell>
                  {new Date(reservation.dateDebut).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {new Date(reservation.dateFin).toLocaleDateString()}
                </TableCell>
                <TableCell>{reservation.statut}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "#e42d0d",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "darkorange",
                      },
                    }}
                    onClick={() => handleGenerateContract(reservation)}
                  >
                    Générer Contrat
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default AllReservations;
