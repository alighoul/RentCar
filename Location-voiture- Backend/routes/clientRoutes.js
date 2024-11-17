const express = require("express");
const router = express.Router();
const Client = require("../models/Client");
const bcrypt = require("bcryptjs"); // Use bcrypt for password hashing if it's being hashed

// Ajouter un nouveau client
router.post("/addclient", async (req, res) => {
  try {
    const newClient = new Client(req.body);
    const savedClient = await newClient.save();
    res.status(201).json(savedClient);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Login route
router.post("/login", async (req, res) => {
  const { email, motDePasse } = req.body;

  try {
    // Find the client by email
    const client = await Client.findOne({ email });
    if (!client) {
      return res.status(404).json({ message: "Client non trouvé" });
    }

    // Check if the password is correct
    const isMatch =
      motDePasse === client.motDePasse ||
      (await bcrypt.compare(motDePasse, client.motDePasse)); // Use bcrypt if hashed
    if (!isMatch) {
      return res.status(401).json({ message: "Mot de passe incorrect" });
    }

    // Send success response with full client data
    res.status(200).json({
      message: "Connexion réussie",
      client: { id: client._id, nom: client.nom, email: client.email }, // Include the client's name and other data
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

// Récupérer les informations d'un client par son ID
router.get("/get/:id", async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ message: "Client non trouvé" });
    res.status(200).json(client);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Mettre à jour les informations d'un client
router.put("/update/:id", async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ message: "Client non trouvé" });

    // Mettre à jour les informations du client
    await client.mettreAJourInfos(req.body);
    res
      .status(200)
      .json({ message: "Informations mises à jour avec succès", client });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Supprimer un compte client
router.delete("/delete/:id", async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ message: "Client non trouvé" });

    await client.supprimerCompte();
    res.status(200).json({ message: "Compte client supprimé avec succès" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Consulter l'historique des réservations d'un client
router.get("/historique/:id", async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ message: "Client non trouvé" });

    const historique = await client.consulterHistorique();
    res.status(200).json(historique);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Payer une réservation
router.post("/payer/:id", async (req, res) => {
  try {
    const { reservationId, montant } = req.body;
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ message: "Client non trouvé" });

    const paiement = await client.payerReservation(reservationId, montant);
    res.status(200).json(paiement);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
