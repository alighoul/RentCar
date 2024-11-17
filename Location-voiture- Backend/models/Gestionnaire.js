const mongoose = require("mongoose");

const GestionnaireSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  motDePasse: { type: String, required: true },
});

module.exports = mongoose.model("Gestionnaire", GestionnaireSchema);
