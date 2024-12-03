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
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

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
  const carouselImages = [
    "https://res.cloudinary.com/dmyv5xkhy/image/upload/v1732477229/RentCar/ytqnktguzgmdw6iovnrx.jpg",
    "https://res.cloudinary.com/dmyv5xkhy/image/upload/v1732477222/RentCar/rwj6pfbujbwvemrrubbn.webp",
    "https://res.cloudinary.com/dmyv5xkhy/image/upload/v1732477216/RentCar/ymxcxahtbzftklhkzt6i.jpg",
    "https://res.cloudinary.com/dmyv5xkhy/image/upload/v1732477210/RentCar/af3j0snjeiitxqmqgl4z.jpg",
  ];
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
    if (!reservationData.dateDebut || !reservationData.dateFin) {
      alert("Veuillez sélectionner une date de début et de fin.");
      return;
    }

    const today = new Date();
    const startDate = new Date(reservationData.dateDebut);
    const endDate = new Date(reservationData.dateFin);

    // Validation de la date
    if (startDate < today || endDate < today) {
      alert("Les dates ne peuvent pas être dans le passé.");
      return;
    }

    if (startDate > endDate) {
      alert("La date de début doit être avant la date de fin.");
      return;
    }

    if (client && selectedVehicle) {
      try {
        await axios.post("http://localhost:3000/reservation/add", {
          clientId: client.id,
          vehiculeId: selectedVehicle._id,
          dateDebut: reservationData.dateDebut,
          dateFin: reservationData.dateFin,
        });

        alert("Réservation réussie !");
        closeReservationModal();
      } catch (error) {
        console.error("Erreur lors de la réservation :", error);

        if (error.response && error.response.data.message) {
          alert(error.response.data.message);
        } else {
          alert("Échec de la réservation. Veuillez réessayer.");
        }
      }
    } else {
      alert("Veuillez vous connecter pour réserver un véhicule.");
      navigate("/login");
    }
  };

  const filterVehicles = async () => {
    const { dateDebut, dateFin, marque, modele, prixMin, prixMax } =
      reservationData;

    try {
      // Fetch vehicles based on date
      const dateFilteredVehicles =
        dateDebut && dateFin
          ? await axios
              .post("http://localhost:3000/reservation/available", {
                dateDebut,
                dateFin,
              })
              .then((res) => res.data)
          : vehicles;

      // Further filter by marque, modele, and price
      const filtered = dateFilteredVehicles.filter(
        (vehicle) =>
          (!marque || vehicle.marque === marque) &&
          (!modele || vehicle.modele === modele) &&
          vehicle.prixJournalier >= prixMin &&
          vehicle.prixJournalier <= prixMax
      );

      setFilteredVehicles(filtered);
    } catch (error) {
      console.error("Error filtering vehicles:", error);
      alert("Error filtering vehicles. Please try again.");
    }
  };

  return (
    <Container>
      {/* Carousel Section */}
      <Box sx={{ mb: 4 }}>
        <Carousel showThumbs={false} autoPlay infiniteLoop>
          {carouselImages.map((image, index) => (
            <div key={index}>
              <img
                src={image}
                alt={`Carousel ${index + 1}`}
                style={{
                  height: "400px",
                  objectFit: "cover",
                  border: "2px solid orange",
                }}
              />
            </div>
          ))}
        </Carousel>
      </Box>
      <Grid container spacing={2}>
        {/* Left Column: Filter Section */}
        <Grid item xs={12} sm={3}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Typography
              variant="body2"
              sx={{ fontSize: "1rem", color: "gray", fontWeight: "bold" }}
            >
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
            <Typography
              variant="body2"
              sx={{ fontSize: "1rem", color: "gray", mt: 1 }}
            >
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
              onClick={filterVehicles}
              size="small"
              sx={{
                mt: 1,
                fontSize: "0.8rem",
                backgroundColor: "orange",
                "&:hover": { backgroundColor: "darkorange" },
              }}
            >
              Filter
            </Button>
          </Box>
        </Grid>

        {/* Right Column: Vehicle Cards Section */}
        <Grid item xs={12} sm={9}>
          <Card sx={{ p: 2, backgroundColor: "#f8f8f8" }}>
            <Typography variant="h5" sx={{ mb: 2, color: "orange" }}>
              Vehicles Available for Reservation
            </Typography>
            <Grid container spacing={2}>
              {(filteredVehicles.length ? filteredVehicles : vehicles).map(
                (vehicle) => (
                  <Grid item xs={12} sm={6} md={4} key={vehicle._id}>
                    <Card
                      sx={{
                        backgroundColor: "white",
                        border: "1px solid gray",
                      }}
                    >
                      <CardContent>
                        {vehicle.images.length > 0 && (
                          <img
                            src={vehicle.images[0]}
                            alt={`${vehicle.marque} ${vehicle.modele}`}
                            style={{
                              width: "100%",
                              height: "200px",
                              objectFit: "cover",
                              borderBottom: "2px solid orange",
                            }}
                          />
                        )}
                        <Typography
                          variant="h6"
                          sx={{ mt: 2, color: "orange" }}
                        >
                          {vehicle.marque} {vehicle.modele}
                        </Typography>
                        <Typography sx={{ color: "gray" }}>
                          Price per day: {vehicle.prixJournalier} dt
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => openReservationModal(vehicle)}
                          size="small"
                          sx={{
                            backgroundColor: "orange",
                            "&:hover": {
                              backgroundColor: "darkorange",
                            },
                          }}
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
