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
  return (
    <Modal open={isOpen} onClose={onClose}>
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
          Reserve {vehicle?.marque} {vehicle?.modele}
        </Typography>
        <TextField
          fullWidth
          label="Start Date"
          type="date"
          name="dateDebut"
          value={reservationData.dateDebut}
          onChange={onChange}
          InputLabelProps={{ shrink: true }}
          sx={{ mt: 2 }}
        />
        <TextField
          fullWidth
          label="End Date"
          type="date"
          name="dateFin"
          value={reservationData.dateFin}
          onChange={onChange}
          InputLabelProps={{ shrink: true }}
          sx={{ mt: 2 }}
        />
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
          <Button variant="contained" color="primary" onClick={onConfirm}>
            Confirm Reservation
          </Button>
          <Button variant="outlined" color="secondary" onClick={onClose}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ReservationCart;
