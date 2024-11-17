const mongoose = require("mongoose");

const VehiculeSchema = new mongoose.Schema({
  marque: { type: String, required: true },
  modele: { type: String, required: true },
  prixJournalier: { type: Number, required: true }, 
  images: [{ type: String }],
});

module.exports = mongoose.model("Vehicule", VehiculeSchema);
