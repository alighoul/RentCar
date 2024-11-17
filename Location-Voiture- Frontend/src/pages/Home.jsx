// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Button,
  Container,
  Modal,
  Typography,
  Card,
  CardContent,
  CardActions,
  Grid,
  TextField,
  Menu,
  MenuItem,
  IconButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

const Home = () => {
  const navigate = useNavigate();
  const client = JSON.parse(sessionStorage.getItem("client"));
  const [vehicles, setVehicles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [reservationData, setReservationData] = useState({
    dateDebut: "",
    dateFin: "",
  });
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    // Fetch all vehicles from the backend
    const fetchVehicles = async () => {
      try {
        const response = await axios.get("http://localhost:3000/vehicule/all");
        setVehicles(response.data);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      }
    };

    fetchVehicles();
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("client");
    navigate("/login");
  };

  const openReservationModal = (vehicle) => {
    setSelectedVehicle(vehicle);
    setIsModalOpen(true);
  };

  const closeReservationModal = () => {
    setIsModalOpen(false);
    setSelectedVehicle(null);
    setReservationData({ dateDebut: "", dateFin: "" });
  };

  const handleReservationChange = (e) => {
    const { name, value } = e.target;
    setReservationData((prev) => ({ ...prev, [name]: value }));
  };

  const confirmReservation = async () => {
    if (client && selectedVehicle) {
      try {
        await axios.post("http://localhost:3000/reservation/add", {
          clientId: client.id,
          vehiculeId: selectedVehicle._id,
          dateDebut: reservationData.dateDebut,
          dateFin: reservationData.dateFin,
        });

        alert("Reservation successful!");
        closeReservationModal();
      } catch (error) {
        console.error("Error making reservation:", error);
        alert("Failed to reserve vehicle.");
      }
    } else {
      alert("Please log in to make a reservation.");
      navigate("/login");
    }
  };

  const openMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorEl(null);
  };

  return (
    <Container>
      <Box
        sx={{ display: "flex", justifyContent: "space-between", mt: 4, mb: 2 }}
      >
        <Typography variant="h4">
          Welcome, {client ? client.nom : "Guest"}
        </Typography>
        <IconButton onClick={openMenu}>
          <MenuIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={closeMenu}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Box>

      <Card sx={{ p: 2, mt: 2 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Vehicles Available for Reservation
        </Typography>
        <Grid container spacing={2}>
          {vehicles.map((vehicle) => (
            <Grid item xs={12} sm={6} md={4} key={vehicle._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">
                    {vehicle.marque} {vehicle.modele}
                  </Typography>
                  <Typography>
                    Price per day: ${vehicle.prixJournalier}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => openReservationModal(vehicle)}
                  >
                    Reserve
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Card>

      <Modal open={isModalOpen} onClose={closeReservationModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" component="h2">
            Reserve {selectedVehicle?.marque} {selectedVehicle?.modele}
          </Typography>
          <TextField
            fullWidth
            label="Start Date"
            type="date"
            name="dateDebut"
            value={reservationData.dateDebut}
            onChange={handleReservationChange}
            InputLabelProps={{ shrink: true }}
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="End Date"
            type="date"
            name="dateFin"
            value={reservationData.dateFin}
            onChange={handleReservationChange}
            InputLabelProps={{ shrink: true }}
            sx={{ mt: 2 }}
          />
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={confirmReservation}
            >
              Confirm Reservation
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={closeReservationModal}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </Container>
  );
};

export default Home;
