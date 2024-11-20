// routes/reservationRoutes.js
const express = require("express");
const Reservation = require("../models/Reservation");
const client = require("../models/Client");
const Vehicule = require("../models/Vehicule");
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

// Route to check available vehicles within a date range
router.post("/available", async (req, res) => {
  const { dateDebut, dateFin } = req.body;

  try {
    const reservedVehiculeIds = await Reservation.find({
      statut: "en cours", // Active reservations only
      $or: [{ dateDebut: { $lte: dateFin }, dateFin: { $gte: dateDebut } }],
    }).distinct("vehiculeId");

    // Fetch all vehicles not reserved in the date range
    const availableVehicles = await Vehicule.find({
      _id: { $nin: reservedVehiculeIds },
    });

    res.status(200).json(availableVehicles);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des véhicules disponibles",
      error: error.message,
    });
  }
});

// Route pour obtenir toutes les réservations
router.get("/all", async (req, res) => {
  try {
    // Récupérer toutes les réservations et leurs détails associés
    const reservations = await Reservation.find()
      .populate("clientId") // Récupère les informations du client
      .populate("vehiculeId"); // Récupère les informations du véhicule

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

// Route to check available vehicles within a date range
router.post("/checkDisponibilite", async (req, res) => {
  const { dateDebut, dateFin } = req.body;

  try {
    // Convert the dateDebut and dateFin to Date objects
    const startDate = new Date(dateDebut);
    const endDate = new Date(dateFin);

    // Find vehicles that are already reserved within the date range
    const reservedVehiculeIds = await Reservation.find({
      statut: "en cours", // Only check active reservations
      $or: [
        { dateDebut: { $lte: endDate }, dateFin: { $gte: startDate } }, // Overlapping range
      ],
    }).distinct("vehiculeId");

    // Fetch all vehicles not reserved in the date range
    const availableVehicles = await Vehicule.find({
      _id: { $nin: reservedVehiculeIds },
    });

    res.status(200).json(availableVehicles);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching available vehicles",
      error: error.message,
    });
  }
});

module.exports = router;
