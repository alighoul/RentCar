// routes/reservationRoutes.js
const express = require("express");
const Reservation = require("../models/Reservation");
const client = require("../models/Client");
const router = express.Router();

// Route pour effectuer une réservation
router.post("/add", async (req, res) => {
  const { clientId, vehiculeId, dateDebut, dateFin } = req.body;

  try {
    const reservation = await Reservation.effectuerReservation(
      clientId,
      vehiculeId,
      dateDebut,
      dateFin
    );
    res.status(201).json(reservation);
  } catch (error) {
    res.status(400).json({
      message: "Erreur lors de l'enregistrement de la réservation",
      error: error.message,
    });
  }
});

// Route pour annuler une réservation
router.put("/cancel/:id", async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation)
      return res.status(404).json({ message: "Réservation non trouvée" });

    await reservation.annulerReservation();
    res.status(200).json({ message: "Réservation annulée avec succès" });
  } catch (error) {
    res.status(400).json({
      message: "Erreur lors de l'annulation de la réservation",
      error: error.message,
    });
  }
});

// Route pour calculer le coût total d'une réservation
router.get("/total/:id", async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id).populate(
      "vehiculeId"
    );
    if (!reservation) {
      return res.status(404).json({ message: "Réservation non trouvée" });
    }

    if (!reservation.vehiculeId) {
      return res
        .status(404)
        .json({ message: "Véhicule associé à cette réservation non trouvé" });
    }

    const duree = Math.ceil(
      (new Date(reservation.dateFin) - new Date(reservation.dateDebut)) /
        (1000 * 60 * 60 * 24)
    );
    const total = duree * reservation.vehiculeId.prixJournalier;
    res.status(200).json({ total });
  } catch (error) {
    res.status(400).json({
      message: "Erreur lors du calcul du coût total",
      error: error.message,
    });
  }
});

router.get("/getReservation/:id", async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id)
      .populate("clientId") // Récupère les détails du client
      .populate("vehiculeId"); // Récupère les détails du véhicule

    if (!reservation) {
      return res.status(404).json({ message: "Réservation non trouvée" });
    }

    res.status(200).json(reservation);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});
// Route pour obtenir toutes les réservations
router.get("/all", async (req, res) => {
  try {
    // Récupérer toutes les réservations et leurs détails associés
    const reservations = await Reservation.find()
      .populate("clientId")  // Récupère les informations du client
      .populate("vehiculeId");  // Récupère les informations du véhicule

    if (!reservations || reservations.length === 0) {
      return res.status(404).json({ message: "Aucune réservation trouvée" });
    }

    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({
      message: "Erreur serveur lors de la récupération des réservations",
      error: error.message,
    });
  }
});
module.exports = router;
