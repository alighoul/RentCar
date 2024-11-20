import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Button,
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Grid,
  TextField,
  Menu,
  MenuItem,
  IconButton,
  Select,
  InputLabel,
  FormControl,
  Slider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ReservationCart from "../components/Cart/ReservationCart";

const Home = () => {
  const navigate = useNavigate();
  const client = JSON.parse(sessionStorage.getItem("client"));
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [reservationData, setReservationData] = useState({
    dateDebut: "",
    dateFin: "",
    marque: "",
    modele: "",
    prixMin: 0,
    prixMax: 1000,
  });
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await axios.get("http://localhost:3000/vehicule/all");
        setVehicles(response.data);
        setBrands([...new Set(response.data.map((vehicle) => vehicle.marque))]);
        setModels([...new Set(response.data.map((vehicle) => vehicle.modele))]);
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
    setReservationData({
      dateDebut: "",
      dateFin: "",
      marque: "",
      modele: "",
      prixMin: 0,
      prixMax: 1000,
    });
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

        if (error.response && error.response.data.message) {
          alert(error.response.data.message);
        } else {
          alert("Failed to reserve vehicle. Please try again.");
        }
      }
    } else {
      alert("Please log in to make a reservation.");
      navigate("/login");
    }
  };

  const filterVehiclesByDate = async () => {
    const { dateDebut, dateFin, marque, modele, prixMin, prixMax } =
      reservationData;
    if (dateDebut && dateFin) {
      try {
        const response = await axios.post(
          "http://localhost:3000/reservation/available",
          {
            dateDebut,
            dateFin,
            marque,
            modele,
            prixMin,
            prixMax,
          }
        );
        setFilteredVehicles(response.data); // Set filtered vehicles based on the selected filters
      } catch (error) {
        console.error("Error filtering vehicles:", error);
        alert("Error filtering vehicles. Please try again.");
      }
    } else {
      alert("Please select both start and end dates.");
    }
  };

  return (
    <Container>
      <Box
        sx={{ display: "flex", justifyContent: "space-between", mt: 3, mb: 2 }}
      >
        <Typography variant="h4">
          Welcome, {client ? client.nom : "Guest"}
        </Typography>
        <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
          <MenuIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
          <MenuItem onClick={() => navigate("/reservations")}>
            My Reservations
          </MenuItem>{" "}
          {/* New menu item */}
        </Menu>
      </Box>

      <Grid container spacing={2}>
        {/* Left Column: Filter Section */}
        <Grid item xs={12} sm={3}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Typography variant="body2" sx={{ fontSize: "0.85rem", mb: 1 }}>
              Filter Vehicles
            </Typography>

            {/* Date Filters */}
            <TextField
              label="Start Date"
              type="date"
              name="dateDebut"
              value={reservationData.dateDebut}
              onChange={handleReservationChange}
              InputLabelProps={{ shrink: true }}
              size="small"
              sx={{ width: "100%", "& .MuiInputBase-root": { height: 35 } }}
            />
            <TextField
              label="End Date"
              type="date"
              name="dateFin"
              value={reservationData.dateFin}
              onChange={handleReservationChange}
              InputLabelProps={{ shrink: true }}
              size="small"
              sx={{ width: "100%", "& .MuiInputBase-root": { height: 35 } }}
            />

            {/* Brand Filter */}
            <FormControl size="small" sx={{ width: "100%" }}>
              <InputLabel>Brand</InputLabel>
              <Select
                name="marque"
                value={reservationData.marque}
                onChange={handleReservationChange}
                label="Brand"
              >
                {brands.map((brand) => (
                  <MenuItem key={brand} value={brand}>
                    {brand}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Model Filter */}
            <FormControl size="small" sx={{ width: "100%" }}>
              <InputLabel>Model</InputLabel>
              <Select
                name="modele"
                value={reservationData.modele}
                onChange={handleReservationChange}
                label="Model"
              >
                {models.map((model) => (
                  <MenuItem key={model} value={model}>
                    {model}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Price Range Filter */}
            <Typography variant="body2" sx={{ fontSize: "0.85rem" }}>
              Price Range
            </Typography>
            <Slider
              value={[reservationData.prixMin, reservationData.prixMax]}
              onChange={(e, newValue) =>
                setReservationData((prev) => ({
                  ...prev,
                  prixMin: newValue[0],
                  prixMax: newValue[1],
                }))
              }
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => `${value} dt`}
              min={0}
              max={1000}
              step={10}
              sx={{ mb: 1 }}
            />

            {/* Filter Button */}
            <Button
              variant="contained"
              onClick={filterVehiclesByDate}
              size="small"
              sx={{ mt: 1, fontSize: "0.8rem", padding: "5px 15px" }}
            >
              Filter
            </Button>
          </Box>
        </Grid>

        {/* Right Column: Vehicle Cards Section */}
        <Grid item xs={12} sm={9}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              Vehicles Available for Reservation
            </Typography>
            <Grid container spacing={2}>
              {(filteredVehicles.length ? filteredVehicles : vehicles).map(
                (vehicle) => (
                  <Grid item xs={12} sm={6} md={4} key={vehicle._id}>
                    <Card>
                      <CardContent>
                        {vehicle.images.length > 0 && (
                          <img
                            src={vehicle.images[0]}
                            alt={`${vehicle.marque} ${vehicle.modele}`}
                            style={{
                              width: "100%",
                              height: "200px",
                              objectFit: "cover",
                            }}
                          />
                        )}
                        <Typography variant="h6" sx={{ mt: 2 }}>
                          {vehicle.marque} {vehicle.modele}
                        </Typography>
                        <Typography>
                          Price per day: {vehicle.prixJournalier} dt
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => openReservationModal(vehicle)}
                          size="small"
                        >
                          Reserve
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                )
              )}
            </Grid>
          </Card>
        </Grid>
      </Grid>

      <ReservationCart
        isOpen={isModalOpen}
        vehicle={selectedVehicle}
        reservationData={reservationData}
        onChange={handleReservationChange}
        onClose={closeReservationModal}
        onConfirm={confirmReservation}
      />
    </Container>
  );
};

export default Home;
