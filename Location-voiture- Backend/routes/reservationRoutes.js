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
// Route pour mettre à jour le statut d'une réservation en "payée"
router.put("/updateStatus/payee/:id", async (req, res) => {
  try {
    // Rechercher la réservation par ID
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({ message: "Réservation non trouvée" });
    }

    // Vérifier si la réservation est déjà payée
    if (reservation.statut === "payée") {
      return res.status(400).json({ message: "La réservation est déjà payée" });
    }

    // Mettre à jour le statut en "payée"
    reservation.statut = "payée";

    // Sauvegarder les modifications dans la base de données
    await reservation.save();

    // Répondre avec succès et inclure la réservation mise à jour
    res.status(200).json({
      message: "Le statut de la réservation a été mis à jour en 'payée'",
      reservation,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la mise à jour du statut en 'payée'",
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

router.get("/filter", async (req, res) => {
  try {
    const { status, startDate, endDate, clientId } = req.query;

    // Créer un filtre dynamique
    const filter = { clientId };

    if (status) filter.statut = status;
    if (startDate) filter.dateDebut = { $gte: new Date(startDate) };
    if (endDate)
      filter.dateFin = { ...filter.dateFin, $lte: new Date(endDate) };

    const reservations = await Reservation.find(filter).populate("vehiculeId");
    res.json(reservations);
  } catch (error) {
    console.error("Erreur lors du filtrage des réservations:", error);
    res.status(500).json({ error: "Erreur lors du filtrage des réservations" });
  }
});

module.exports = router;

// Route pour récupérer une réservation spécifique
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

// Route pour vérifier les véhicules disponibles dans une plage de dates
router.post("/available", async (req, res) => {
  const { dateDebut, dateFin } = req.body;

  try {
    const reservedVehiculeIds = await Reservation.find({
      statut: "en cours", // Réservations actives uniquement
      $or: [{ dateDebut: { $lte: dateFin }, dateFin: { $gte: dateDebut } }],
    }).distinct("vehiculeId");

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

// Route pour vérifier la disponibilité des véhicules dans une plage de dates
router.post("/checkDisponibilite", async (req, res) => {
  const { dateDebut, dateFin } = req.body;

  try {
    const startDate = new Date(dateDebut);
    const endDate = new Date(dateFin);

    const reservedVehiculeIds = await Reservation.find({
      statut: "en cours",
      $or: [{ dateDebut: { $lte: endDate }, dateFin: { $gte: startDate } }],
    }).distinct("vehiculeId");

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

// Route pour payer une réservation
router.put("/pay/:id", async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({ message: "Réservation non trouvée" });
    }

    // Vérifier si la réservation a déjà été payée
    if (reservation.statut === "payée") {
      return res.status(400).json({ message: "Réservation déjà payée" });
    }

    // Simulation du paiement (remplacez ceci par une logique de paiement réelle)
    // Par exemple, vous pourriez appeler un service comme Stripe ou PayPal ici

    // Si le paiement est réussi, mettre à jour le statut
    reservation.statut = "payée";

    // Enregistrer les modifications dans la base de données
    await reservation.save();

    // Répondre avec succès
    res
      .status(200)
      .json({ message: "Réservation payée avec succès", reservation });
  } catch (error) {
    res.status(400).json({
      message: "Erreur lors du paiement de la réservation",
      error: error.message,
    });
  }
});

module.exports = router;
