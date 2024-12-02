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
  Snackbar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  CircularProgress,
} from "@mui/material";
import AddVehicule from "../../components/Cart/AddVehicule"; // Importer le composant AddVehicule
import { format, isValid } from "date-fns"; // Assurez-vous que 'date-fns' est installé
import Badge from "@mui/material/Badge";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Alert from "@mui/material/Alert";

const HomeAdmin = () => {
  const [vehicles, setVehicles] = useState([]);
  const [showAddVehicule, setShowAddVehicule] = useState(false); // État pour afficher ou masquer AddVehicule
  const [vehicleToEdit, setVehicleToEdit] = useState(null); // État pour le véhicule à modifier
  const [openDialog, setOpenDialog] = useState(false); // État pour gérer l'ouverture du dialog
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false); // État pour gérer l'ouverture du dialog de suppression
  const [vehicleToDelete, setVehicleToDelete] = useState(null); // Stocker le véhicule à supprimer
  const [payments, setPayments] = useState([]); // État pour stocker les paiements
  const [openPaymentsDialog, setOpenPaymentsDialog] = useState(false); // État pour gérer l'ouverture du dialog des paiements
  const [notificationMessage, setNotificationMessage] = useState("");
  const [currentNotification, setCurrentNotification] = useState(""); // Message de notification actuel
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  // Notifications
  const [notifications, setNotifications] = useState([]); // Stocker les notifications
  const [notificationOpen, setNotificationOpen] = useState(false); // État pour ouvrir/fermer le dialog des notifications

  useEffect(() => {
    fetchVehicles();
    fetchNotifications(); // Appeler la fonction pour récupérer les notifications
  }, []);
  useEffect(() => {
    if (notifications.length > 0 && !snackbarOpen) {
      showNextNotification();
    }
  }, [notifications, snackbarOpen]);
  useEffect(() => {
    console.log("Paiements reçus :", payments);
  }, [payments]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchVehicles();
        await fetchNotifications(); // Wait for both data fetching to finish
        setLoading(false); // Set loading to false once data is fetched
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        setLoading(false); // In case of error, set loading to false
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures this runs once when the component mounts

  const handleNotificationClose = () => {
    setNotificationOpen(false); // Close the notification Snackbar
  };

  const fetchVehicles = async () => {
    try {
      const response = await axios.get("http://localhost:3000/vehicule/all");
      setVehicles(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des véhicules:", error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await axios.get("http://localhost:3000/notifications");
      setNotifications(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des notifications:", error);
    }
  };

  const showNextNotification = () => {
    if (notifications.length > 0) {
      const nextNotification = notifications[0];
      setCurrentNotification(nextNotification);
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    setNotifications((prev) => prev.slice(1)); // Retirer la notification affichée
  };

  const handleAddVehiculeClick = () => {
    setVehicleToEdit(null); // Réinitialiser le véhicule à modifier
    setShowAddVehicule(true); // Afficher le composant AddVehicule
  };

  const handleBackToList = () => {
    setShowAddVehicule(false); // Revenir à la liste des véhicules
    fetchVehicles(); // Rafraîchir la liste après ajout ou modification
  };

  const handleEdit = (vehicle) => {
    setVehicleToEdit(vehicle); // Passer le véhicule à modifier
    setOpenDialog(true); // Ouvrir le dialog pour modifier
  };

  const handleCloseDialog = () => {
    setOpenDialog(false); // Fermer le dialog
    setVehicleToEdit(null); // Réinitialiser l'état du véhicule à modifier
  };

  const handleSaveEdit = async () => {
    try {
      // Mettre à jour les données du véhicule via l'API
      await axios.put(
        `http://localhost:3000/vehicule/update/${vehicleToEdit._id}`,
        vehicleToEdit
      );
      fetchVehicles(); // Rafraîchir la liste après la modification
      setOpenDialog(false); // Fermer le dialog
      alert("Véhicule modifié avec succès");
    } catch (error) {
      console.error("Erreur lors de la modification du véhicule:", error);
    }
  };

  const handleDelete = (vehicle) => {
    setVehicleToDelete(vehicle); // Stocker le véhicule à supprimer
    setOpenDeleteDialog(true); // Ouvrir le dialog de confirmation
  };

  const handleConfirmDelete = async () => {
    try {
      // Supprimer le véhicule via l'API
      await axios.delete(
        `http://localhost:3000/vehicule/delete/${vehicleToDelete._id}`
      );
      fetchVehicles(); // Rafraîchir la liste après suppression
      setOpenDeleteDialog(false); // Fermer le dialog de confirmation
      alert("Véhicule supprimé avec succès");
    } catch (error) {
      console.error("Erreur lors de la suppression du véhicule:", error);
    }
  };

  const handleCancelDelete = () => {
    setOpenDeleteDialog(false); // Fermer le dialog sans supprimer
    setVehicleToDelete(null); // Réinitialiser l'état du véhicule à supprimer
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVehicleToEdit((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const fetchPayments = async () => {
    try {
      const response = await axios.get("http://localhost:3000/paiement/AllP"); // Endpoint pour récupérer les paiements
      setPayments(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des paiements:", error);
    }
  };
  const handleViewPayments = () => {
    fetchPayments(); // Charger les paiements
    setOpenPaymentsDialog(true); // Ouvrir le dialog des paiements
  };

  const handleClosePaymentsDialog = () => {
    setOpenPaymentsDialog(false); // Fermer le dialog des paiements
  };

  // Gérer l'ouverture/fermeture du dialog des notifications
  const handleNotificationClick = () => {
    setNotificationOpen(true); // No need for parameters
  };

  const handleCloseNotifications = () => {
    setNotificationOpen(false);
  };
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

  return (
    <Container>
      {/* Afficher la liste des véhicules si le formulaire n'est pas affiché */}
      {!showAddVehicule ? (
        <>
          <Typography variant="h4" sx={{ mb: 4, color: "gray" }}>
            Gestion des véhicules
          </Typography>

          {/* Bouton Ajouter un véhicule */}
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddVehiculeClick}
            sx={{
              mb: 4,
              bgcolor: "orange",
              color: "white",
              "&:hover": { bgcolor: "darkorange" },
            }}
          >
            Ajouter un véhicule
          </Button>

          {/* Bouton Visualiser les paiements */}
          <Button
            variant="contained"
            color="secondary"
            onClick={handleViewPayments}
            sx={{
              mb: 4,
              ml: 2,
              bgcolor: "gray",
              color: "white",
              "&:hover": { bgcolor: "darkgray" },
            }}
          >
            Visualiser les paiements
          </Button>

          {/* Liste des véhicules */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: "gray" }}>
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
                            borderRadius: "4px",
                          }}
                        />
                      )}
                      <Typography variant="subtitle1" sx={{ color: "orange" }}>
                        {vehicle.marque} - {vehicle.modele}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "gray" }}>
                        Prix journalier: {vehicle.prixJournalier} dt
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        <Button
                          variant="outlined"
                          color="primary"
                          sx={{
                            mr: 1,
                            color: "orange",
                            borderColor: "orange",
                            "&:hover": {
                              bgcolor: "orange",
                              color: "white",
                            },
                          }}
                          onClick={() => handleEdit(vehicle)} // Passer le véhicule à modifier
                        >
                          Modifier
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => handleDelete(vehicle)} // Afficher le dialog de confirmation
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
        </>
      ) : (
        // Affichage du composant AddVehicule si showAddVehicule est vrai
        <AddVehicule
          vehicle={vehicleToEdit} // Passer le véhicule à modifier (ou null si ajout)
          onBack={handleBackToList} // Passer la fonction handleBackToList ici
        />
      )}

      {/* Icône de notification avec badge */}
      <Badge
        badgeContent={notifications.length} // Afficher le nombre de notifications
        color="primary"
        invisible={notifications.length === 0} // Masquer si aucune notification
        sx={{ cursor: "pointer", position: "fixed", top: 20, right: 20 }}
        onClick={() => handleNotificationClick(notifications[0])} // Afficher la première notification (exemple)
      >
        <NotificationsIcon sx={{ fontSize: 30, color: "orange" }} />
      </Badge>

      {/* Snackbar pour les notifications */}
      {currentNotification && (
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={5000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={currentNotification.type || "info"}
            sx={{ width: "100%" }}
          >
            {currentNotification.message}
          </Alert>
        </Snackbar>
      )}
      {/* Dialog de confirmation de suppression */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCancelDelete}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ color: "gray" }}>
          Confirmer la suppression
        </DialogTitle>
        <DialogContent>
          <Typography>
            Êtes-vous sûr de vouloir supprimer ce véhicule ?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} sx={{ color: "gray" }}>
            Annuler
          </Button>
          <Button
            sx={{
              color: "white",
              bgcolor: "orange",
              "&:hover": { bgcolor: "darkorange" },
            }}
            color="error"
            onClick={handleConfirmDelete} // Confirmer la suppression
          >
            a Supprimer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog pour modifier un véhicule */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle sx={{ color: "gray" }}>Modifier le véhicule</DialogTitle>
        <DialogContent>
          {vehicleToEdit && (
            <>
              <TextField
                label="Marque"
                name="marque"
                value={vehicleToEdit.marque || ""}
                onChange={handleChange}
                fullWidth
                margin="normal"
                sx={{
                  "& .MuiInputLabel-root": { color: "gray" },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "orange" },
                    "&:hover fieldset": { borderColor: "darkorange" },
                    "&.Mui-focused fieldset": { borderColor: "orange" },
                  },
                }}
              />
              <TextField
                label="Modèle"
                name="modele"
                value={vehicleToEdit.modele || ""}
                onChange={handleChange}
                fullWidth
                margin="normal"
                sx={{
                  "& .MuiInputLabel-root": { color: "gray" },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "orange" },
                    "&:hover fieldset": { borderColor: "darkorange" },
                    "&.Mui-focused fieldset": { borderColor: "orange" },
                  },
                }}
              />
              <TextField
                label="Prix journalier"
                name="prixJournalier"
                value={vehicleToEdit.prixJournalier || ""}
                onChange={handleChange}
                fullWidth
                margin="normal"
                sx={{
                  "& .MuiInputLabel-root": { color: "gray" },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "orange" },
                    "&:hover fieldset": { borderColor: "darkorange" },
                    "&.Mui-focused fieldset": { borderColor: "orange" },
                  },
                }}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDialog}
            sx={{
              color: "gray",
              "&:hover": { bgcolor: "whitesmoke" },
            }}
          >
            Annuler
          </Button>
          <Button
            sx={{
              bgcolor: "orange",
              color: "white",
              "&:hover": { bgcolor: "darkorange" },
            }}
            onClick={handleSaveEdit}
          >
            Sauvegarder
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog pour afficher les paiements
      <Dialog open={openPaymentsDialog} onClose={handleClosePaymentsDialog}>
        <DialogTitle>Liste des paiements</DialogTitle>
        <DialogContent>
          {payments.length === 0 ? (
            <Typography>Aucun paiement trouvé</Typography>
          ) : (
            payments.map((payment, index) => (
              <Typography key={index}>
                {payment.client}: {payment.amount} dt -{" "}
                {format(new Date(payment.date), "dd/MM/yyyy")}
              </Typography>
            ))
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePaymentsDialog}>Fermer</Button>
        </DialogActions>
      </Dialog> */}

      <Dialog open={openPaymentsDialog} onClose={handleClosePaymentsDialog}>
        <DialogTitle>Liste des paiements</DialogTitle>
        <DialogContent>
          {payments.length === 0 ? (
            <Typography>Aucun paiement trouvé</Typography>
          ) : (
            payments.map((payment, index) => (
              <Box
                key={index}
                sx={{
                  border: "1px solid #ddd",
                  borderRadius: 4,
                  padding: 2,
                  mb: 2,
                }}
              >
                <Typography>
                  <strong>Client:</strong>{" "}
                  {payment.reservationId.clientId
                    ? `${payment.reservationId.clientId.nom} ${payment.reservationId.clientId.prenom}`
                    : "Non spécifié"}
                </Typography>
                <Typography>
                  <strong>Montant:</strong> {payment.montant} dt
                </Typography>
                <Typography>
                  <strong>Date:</strong>{" "}
                  {new Date(payment.datePaiement).toLocaleDateString()}
                </Typography>
                <Typography>
                  <strong>Méthode de paiement:</strong>{" "}
                  {payment.methodePaiement}
                </Typography>
              </Box>
            ))
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePaymentsDialog}>Fermer</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default HomeAdmin;
