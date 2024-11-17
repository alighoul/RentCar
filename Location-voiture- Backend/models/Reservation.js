const mongoose = require("mongoose");

const ReservationSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    required: true,
  },
  vehiculeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vehicule",
    required: true,
  },
  dateDebut: { type: Date, required: true },
  dateFin: { type: Date, required: true },
  statut: {
    type: String,
    enum: ["en cours", "annulee", "terminee"],
    default: "en cours",
  },
});

ReservationSchema.statics.effectuerReservation = async function (
  clientId,
  vehiculeId,
  dateDebut,
  dateFin
) {
  const nouvelleReservation = new this({
    clientId,
    vehiculeId,
    dateDebut,
    dateFin,
  });
  return await nouvelleReservation.save();
};
ReservationSchema.methods.annulerReservation = async function () {
  this.statut = "annulee";
  return await this.save();
};
module.exports = mongoose.model("Reservation", ReservationSchema);
