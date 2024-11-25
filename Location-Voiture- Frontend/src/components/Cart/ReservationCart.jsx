import React from "react";
import { Box, Button, Modal, Typography, TextField } from "@mui/material";

const ReservationCart = ({
  isOpen,
  vehicle,
  reservationData,
  onChange,
  onClose,
  onConfirm,
}) => {
  const isDataValid =
    reservationData.dateDebut &&
    reservationData.dateFin &&
    new Date(reservationData.dateDebut) <= new Date(reservationData.dateFin);

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "#f5f5f5", // Fond gris clair
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography
          variant="h6"
          component="h2"
          sx={{ color: "#ff9800", mb: 2 }} // Texte orange
        >
          Réserver {vehicle?.marque} {vehicle?.modele}
        </Typography>
        <TextField
          fullWidth
          label="Date de début"
          type="date"
          name="dateDebut"
          value={reservationData.dateDebut}
          onChange={onChange}
          InputLabelProps={{ shrink: true }}
          sx={{
            mt: 2,
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: isDataValid ? "#bdbdbd" : "#e53935",
              }, // Bordure rouge si invalide
              "&.Mui-focused fieldset": { borderColor: "#ff9800" }, // Bordure orange au focus
            },
          }}
          error={!reservationData.dateDebut}
          helperText={
            !reservationData.dateDebut &&
            "Veuillez sélectionner une date de début"
          }
        />
        <TextField
          fullWidth
          label="Date de fin"
          type="date"
          name="dateFin"
          value={reservationData.dateFin}
          onChange={onChange}
          InputLabelProps={{ shrink: true }}
          sx={{
            mt: 2,
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: isDataValid ? "#bdbdbd" : "#e53935",
              }, // Bordure rouge si invalide
              "&.Mui-focused fieldset": { borderColor: "#ff9800" }, // Bordure orange au focus
            },
          }}
          error={
            reservationData.dateFin &&
            new Date(reservationData.dateDebut) >
              new Date(reservationData.dateFin)
          }
          helperText={
            reservationData.dateFin &&
            new Date(reservationData.dateDebut) >
              new Date(reservationData.dateFin) &&
            "La date de fin doit être après la date de début"
          }
        />
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
          <Button
            variant="contained"
            onClick={onConfirm}
            disabled={!isDataValid}
            sx={{
              backgroundColor: isDataValid ? "#ff9800" : "#bdbdbd", // Orange si valide, gris sinon
              color: "#fff",
              "&:hover": {
                backgroundColor: isDataValid ? "#e65100" : "#bdbdbd",
              },
            }}
          >
            Confirmer la réservation
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={onClose}
            sx={{
              borderColor: "#ff9800",
              color: "#ff9800",
              "&:hover": { backgroundColor: "#ff9800", color: "#fff" },
            }}
          >
            Annuler
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ReservationCart;
