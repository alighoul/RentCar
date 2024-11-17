const mongoose = require("mongoose");
const Reservation = require("./Reservation"); // Assurez-vous d'importer le modèle Reservation

const ClientSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  motDePasse: { type: String, required: true },
  adresse: { type: String, required: true },
  telephone: { type: String, required: true },
});

// Méthode d'instance pour afficher l'historique des réservations
ClientSchema.methods.consulterHistorique = async function () {
  try {
    const reservations = await Reservation.find({ clientId: this._id });
    return reservations;
  } catch (error) {
    throw new Error(
      "Erreur lors de la récupération de l'historique: " + error.message
    );
  }
};

// Méthode d'instance pour mettre à jour les informations du client
ClientSchema.methods.mettreAJourInfos = async function (nouvelleInfo) {
  try {
    Object.assign(this, nouvelleInfo); // Met à jour les champs du client avec ceux de nouvelleInfo
    return await this.save();
  } catch (error) {
    throw new Error(
      "Erreur lors de la mise à jour des informations: " + error.message
    );
  }
};

// Méthode d'instance pour supprimer le client
ClientSchema.methods.supprimerCompte = async function () {
  try {
    await this.remove();
    return { message: "Compte client supprimé avec succès" };
  } catch (error) {
    throw new Error(
      "Erreur lors de la suppression du compte: " + error.message
    );
  }
};

// Méthode pour payer une réservation
ClientSchema.methods.payerReservation = async function (
  reservationId,
  montant
) {
  try {
    const reservation = await Reservation.findById(reservationId);
    if (!reservation) throw new Error("Réservation introuvable");

    // Logique de paiement (à adapter en fonction du système de paiement)
    reservation.statut = "payée";
    await reservation.save();

    return { message: "Réservation payée avec succès" };
  } catch (error) {
    throw new Error(
      "Erreur lors du paiement de la réservation: " + error.message
    );
  }
};

module.exports = mongoose.model("Client", ClientSchema);
