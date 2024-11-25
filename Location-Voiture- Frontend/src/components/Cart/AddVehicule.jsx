import React, { useState } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { Box, TextField, Button, Typography } from "@mui/material";

const AddVehicule = ({ vehicle, onBack }) => {
  const [formData, setFormData] = useState({
    marque: vehicle ? vehicle.marque : "",
    modele: vehicle ? vehicle.modele : "",
    prixJournalier: vehicle ? vehicle.prixJournalier : "",
  });
  const [selectedFile, setSelectedFile] = useState(null);

  const onDrop = (acceptedFiles) => {
    setSelectedFile(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/jpeg, image/png",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append("marque", formData.marque);
    formDataToSend.append("modele", formData.modele);
    formDataToSend.append("prixJournalier", formData.prixJournalier);
    formDataToSend.append("image", selectedFile);

    try {
      const response = await axios.post(
        "http://localhost:3000/vehicule/add",
        formDataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      alert("Véhicule ajouté avec succès !");
      onBack();
    } catch (error) {
      console.error("Erreur lors de l'ajout du véhicule:", error);
      alert("Erreur lors de l'ajout du véhicule");
    }
  };

  return (
    <Box
      sx={{
        maxWidth: "600px",
        margin: "auto",
        padding: 3,
        backgroundColor: "#f5f5f5", // Fond gris clair
        borderRadius: "8px",
      }}
    >
      <Typography
        variant="h4"
        sx={{ mb: 3, color: "#ff9800" }} // Texte orange
      >
        Ajouter un véhicule
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Marque"
          name="marque"
          value={formData.marque}
          onChange={handleChange}
          fullWidth
          required
          sx={{
            mb: 2,
            "& .MuiInputLabel-root": { color: "#757575" }, // Label gris
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "#bdbdbd" }, // Bordure grise
              "&:hover fieldset": { borderColor: "#ff9800" }, // Bordure orange au survol
              "&.Mui-focused fieldset": { borderColor: "#ff9800" }, // Bordure orange au focus
            },
          }}
        />
        <TextField
          label="Modèle"
          name="modele"
          value={formData.modele}
          onChange={handleChange}
          fullWidth
          required
          sx={{
            mb: 2,
            "& .MuiInputLabel-root": { color: "#757575" }, // Label gris
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "#bdbdbd" }, // Bordure grise
              "&:hover fieldset": { borderColor: "#ff9800" }, // Bordure orange au survol
              "&.Mui-focused fieldset": { borderColor: "#ff9800" }, // Bordure orange au focus
            },
          }}
        />
        <TextField
          label="Prix Journalier"
          name="prixJournalier"
          value={formData.prixJournalier}
          onChange={handleChange}
          fullWidth
          required
          type="number"
          sx={{
            mb: 2,
            "& .MuiInputLabel-root": { color: "#757575" }, // Label gris
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "#bdbdbd" }, // Bordure grise
              "&:hover fieldset": { borderColor: "#ff9800" }, // Bordure orange au survol
              "&.Mui-focused fieldset": { borderColor: "#ff9800" }, // Bordure orange au focus
            },
          }}
        />
        <Box
          {...getRootProps()}
          sx={{
            border: "2px dashed #bdbdbd", // Bordure grise
            padding: "20px",
            textAlign: "center",
            cursor: "pointer",
            backgroundColor: isDragActive ? "#ffecb3" : "#f5f5f5", // Fond orange clair si actif
            color: "#757575", // Texte gris
          }}
        >
          <input {...getInputProps()} />
          {selectedFile ? (
            <Typography>{selectedFile.name}</Typography>
          ) : (
            <Typography>
              Glissez et déposez une image ici ou cliquez pour sélectionner
            </Typography>
          )}
        </Box>
        <Button
          type="submit"
          variant="contained"
          sx={{
            mt: 3,
            backgroundColor: "#ff9800", // Fond orange
            color: "#fff",
            "&:hover": { backgroundColor: "#e65100" }, // Orange plus foncé au survol
          }}
        >
          Ajouter le véhicule
        </Button>
      </form>
    </Box>
  );
};

export default AddVehicule;
