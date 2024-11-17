const mongoose = require("mongoose");

const PaiementSchema = new mongoose.Schema({
  reservationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Reservation",
    required: true,
  },
  montant: { type: Number, required: true },
  datePaiement: { type: Date, default: Date.now },
  methodePaiement: { type: String, required: true },
});
module.exports = mongoose.model("Paiement", PaiementSchema);
