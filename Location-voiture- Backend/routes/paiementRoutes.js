// routes/paiementRoutes.js
const express = require("express");
const router = express.Router();
const Paiement = require("../models/Paiement");
const Reservation = require("../models/Reservation");

// Route pour effectuer un paiement pour une réservation spécifique
router.post("/payerReservation/:id", async (req, res) => {
  const { reservationId, montant, methodePaiement } = req.body;

  try {
    // Vérifie que la réservation existe
    const reservation = await Reservation.findById(reservationId);
    if (!reservation) {
      return res.status(404).json({ message: "Réservation non trouvée" });
    }

    // Crée et enregistre le paiement
    const paiement = new Paiement({
      reservationId,
      montant,
      methodePaiement,
    });
    const savedPaiement = await paiement.save();

    res.status(201).json({
      message: "Paiement effectué avec succès",
      paiement: savedPaiement,
    });
  } catch (error) {
    res.status(400).json({
      message: "Erreur lors du paiement de la réservation",
      error: error.message,
    });
  }
});

// Route pour enregistrer un paiement
router.post("/effectuerPaiement", async (req, res) => {
  const { reservationId, montant, methodePaiement } = req.body;

  try {
    // Vérifie que la réservation existe
    const reservation = await Reservation.findById(reservationId);
    if (!reservation) {
      return res.status(404).json({ message: "Réservation non trouvée" });
    }

    // Enregistre le paiement
    const paiement = new Paiement({
      reservationId,
      montant,
      methodePaiement,
    });
    const savedPaiement = await paiement.save();

    res.status(201).json({
      message: "Paiement enregistré avec succès",
      paiement: savedPaiement,
    });
  } catch (error) {
    res.status(400).json({
      message: "Erreur lors de l'enregistrement du paiement",
      error: error.message,
    });
  }
});


// Route pour capturer le paiement après approbation
router.post("/execute", async (req, res) => {
  const { orderId } = req.body;

  try {
    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});
    const capture = await client.execute(request);
    res.status(200).json({ message: "Paiement réussi", capture });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'exécution du paiement", error: error.message });
  }
});


// Paiement avec PayPal (routes/paiementRoutes.js)
const paypal = require('@paypal/checkout-server-sdk');

// Configuration PayPal
const environment = new paypal.core.SandboxEnvironment("CLIENT_ID", "SECRET");
const client = new paypal.core.PayPalHttpClient(environment);

// Route pour effectuer un paiement via PayPal
router.post("/paypal", async (req, res) => {
  const { montant, methodePaiement } = req.body;

  try {
    // Créez une demande de paiement
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: "USD",
          value: montant
        }
      }],
      application_context: {
        brand_name: "Your Brand Name",
        return_url: "http://localhost:3000/paiement/execute",
        cancel_url: "http://localhost:3000/paiement/cancel"
      }
    });

    const order = await client.execute(request);
    res.status(200).json({ approval_url: order.result.links[1].href }); // URL pour rediriger l'utilisateur vers PayPal
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la création de la commande PayPal", error: error.message });
  }
});





// Paiement avec Stripe (routes/paiementRoutes.js)
const stripe = require('stripe')('your_stripe_secret_key');

// Route pour effectuer un paiement via Stripe
router.post("/stripe", async (req, res) => {
  const { montant, methodePaiement, token } = req.body; // token est récupéré du frontend via Stripe.js

  try {
    // Crée une charge Stripe
    const charge = await stripe.charges.create({
      amount: montant * 100, // Stripe utilise des cents
      currency: 'usd',
      description: 'Paiement de réservation',
      source: token, // Le token obtenu du frontend
    });

    res.status(200).json({ message: "Paiement effectué avec succès", charge });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors du paiement", error: error.message });
  }
});

module.exports = router;
