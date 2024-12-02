const express = require("express");
const router = express.Router();
const Paiement = require("../models/Paiement");
const Reservation = require("../models/Reservation");
const stripe = require("stripe")("your_stripe_secret_key");
const paypal = require("@paypal/checkout-server-sdk");

// Route pour effectuer un paiement via Stripe
router.post("/paiementStripe", async (req, res) => {
  const { reservationId, montant, token } = req.body;

  try {
    // Vérifie si la réservation existe
    const reservation = await Reservation.findById(reservationId);
    if (!reservation) {
      return res.status(404).json({ message: "Réservation non trouvée" });
    }

    // Effectue le paiement via Stripe
    const charge = await stripe.charges.create({
      amount: montant * 100, // Montant en centimes
      currency: "usd", // Devise
      description: `Paiement pour la réservation ${reservationId}`,
      source: token,
    });

    // Enregistre le paiement dans MongoDB
    const paiement = new Paiement({
      reservationId,
      montant,
      methodePaiement: "Stripe",
    });
    await paiement.save();

    // Met à jour le statut de la réservation
    reservation.statut = "payée";
    await reservation.save();

    res.status(201).json({
      message: "Paiement effectué avec succès",
      paiement,
      charge,
    });
  } catch (error) {
    console.error("Erreur lors du paiement Stripe:", error.message);
    res.status(500).json({ message: "Erreur lors du paiement", error });
  }
});

// Route pour effectuer un paiement via PayPal
router.post("/paypal", async (req, res) => {
  const { montant, reservationId } = req.body;

  // Configuration PayPal
  const environment = new paypal.core.SandboxEnvironment("CLIENT_ID", "SECRET");
  const client = new paypal.core.PayPalHttpClient(environment);

  try {
    // Créez une demande de paiement
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: montant,
          },
        },
      ],
      application_context: {
        brand_name: "Your Brand Name",
        return_url: "http://localhost:3000/paiement/execute",
        cancel_url: "http://localhost:3000/paiement/cancel",
      },
    });

    const order = await client.execute(request);
    res.status(200).json({ approval_url: order.result.links[1].href });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la création de la commande PayPal",
      error: error.message,
    });
  }
});

// Route pour capturer un paiement PayPal après approbation
router.post("/execute", async (req, res) => {
  const { orderId, reservationId } = req.body;

  const environment = new paypal.core.SandboxEnvironment("CLIENT_ID", "SECRET");
  const client = new paypal.core.PayPalHttpClient(environment);

  try {
    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});
    const capture = await client.execute(request);

    // Vérifie que la réservation existe
    const reservation = await Reservation.findById(reservationId);
    if (!reservation) {
      return res.status(404).json({ message: "Réservation non trouvée" });
    }

    // Enregistrer le paiement
    const paiement = new Paiement({
      reservationId,
      montant: capture.result.purchase_units[0].amount.value,
      methodePaiement: "PayPal",
    });
    const savedPaiement = await paiement.save();

    // Mettre à jour la réservation pour marquer comme payée
    reservation.statut = "payée"; // Met à jour le statut
    await reservation.save();

    res.status(200).json({
      message: "Paiement PayPal effectué avec succès",
      capture,
      paiement: savedPaiement,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de l'exécution du paiement PayPal",
      error: error.message,
    });
  }
});

router.post("/effectuerPaiement", async (req, res) => {
  const { reservationId, montant, methodePaiement } = req.body;

  try {
    // Vérifie que la réservation existe
    const reservation = await Reservation.findById(reservationId);
    if (!reservation) {
      return res.status(404).json({ message: "Réservation non trouvée" });
    }

    // Crée et enregistre le paiement dans la base de données
    const paiement = new Paiement({
      reservationId,
      montant,
      methodePaiement,
    });
    const savedPaiement = await paiement.save();

    // Mettre à jour la réservation pour marquer comme payée
    reservation.statut = "payée"; // Met à jour le statut
    await reservation.save();

    res.status(201).json({
      message: "Paiement enregistré avec succès",
      paiement: savedPaiement,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors du paiement de la réservation",
      error: error.message,
    });
  }
});

// Route pour supprimer tous les paiements
router.delete("/supprimerTousLesPaiements", async (req, res) => {
  try {
    // Supprimer tous les paiements de la base de données
    const result = await Paiement.deleteMany({});

    // Vérifiez si la suppression a été effectuée
    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ message: "Aucun paiement trouvé à supprimer." });
    }

    res
      .status(200)
      .json({ message: "Tous les paiements ont été supprimés avec succès." });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la suppression des paiements",
      error: error.message,
    });
  }
});

// Route pour afficher tous les paiements avec les informations des clients associés
router.get("/AllP", async (req, res) => {
  try {
    // Récupérer tous les paiements, les informations de réservation et les clients
    const paiements = await Paiement.find().populate({
      path: "reservationId",
      populate: {
        path: "clientId", // Peupler les données du client à partir de Reservation
        select: "nom prenom email", // Champs à récupérer
      },
    });

    // Vérifier si des paiements existent
    if (paiements.length === 0) {
      return res.status(404).json({ message: "Aucun paiement trouvé." });
    }

    // Renvoi des paiements en réponse
    res.status(200).json(paiements);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des paiements",
      error: error.message,
    });
  }
});

module.exports = router;
