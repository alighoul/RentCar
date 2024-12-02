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
    enum: ["en cours", "annulee", "terminee", "payée"],
    default: "en cours",
  },
});

ReservationSchema.statics.effectuerReservation = async function (
  clientId,
  vehiculeId,
  dateDebut,
  dateFin
) {
  // Check if the vehicle is already reserved within the date range
  const existingReservation = await this.findOne({
    vehiculeId,
    statut: "en cours", // Only check active reservations
    $or: [
      { dateDebut: { $lte: dateFin }, dateFin: { $gte: dateDebut } }, // Overlapping range
    ],
  });

  if (existingReservation) {
    throw new Error(
      "The vehicle is already reserved during the selected dates."
    );
  }

  // Proceed to create a new reservation
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
