const express = require("express");
const router = express.Router();
const Paiement = require("../models/Paiement"); // Assuming Paiement model exists
const Gestionnaire = require("../models/Gestionnaire");

// Route to visualize payments (visualiserPaiements)
router.get("/:id/visualiserPaiements", async (req, res) => {
  try {
    const gestionnaireId = req.params.id;
    const gestionnaire = await Gestionnaire.findById(gestionnaireId);
    if (!gestionnaire) {
      return res.status(404).json({ message: "Gestionnaire non trouvé" });
    }

    const paiements = await Paiement.find();
    res.status(200).json(paiements);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

// Route to manage payments (gererPaiements)
router.post("/:id/gererPaiements/:paiementId", async (req, res) => {
  try {
    const gestionnaireId = req.params.id;
    const paiementId = req.params.paiementId;

    const gestionnaire = await Gestionnaire.findById(gestionnaireId);
    if (!gestionnaire) {
      return res.status(404).json({ message: "Gestionnaire non trouvé" });
    }

    const paiement = await Paiement.findById(paiementId);
    if (!paiement) {
      return res.status(404).json({ message: "Paiement non trouvé" });
    }

    // Implement logic for managing payments
    paiement.statut = req.body.statut || paiement.statut; // Example: updating the payment status
    await paiement.save();

    res
      .status(200)
      .json({ message: "Paiement mis à jour avec succès", paiement });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

// Ajouter un nouveau gestionnaire (sans hachage du mot de passe)
router.post("/add", async (req, res) => {
  const { nom, email, motDePasse } = req.body;

  // Validation des champs requis
  if (!nom || !email || !motDePasse) {
    return res.status(400).json({ message: "Tous les champs sont requis" });
  }

  try {
    // Vérifier si un gestionnaire existe déjà avec cet email
    const existingGestionnaire = await Gestionnaire.findOne({ email });
    if (existingGestionnaire) {
      return res.status(400).json({ message: "Email déjà utilisé" });
    }

    // Créer un nouveau gestionnaire sans hachage du mot de passe
    const newGestionnaire = new Gestionnaire({
      nom,
      email,
      motDePasse, // Stockage direct du mot de passe en texte clair
    });

    // Sauvegarder dans la base de données
    const savedGestionnaire = await newGestionnaire.save();

    res.status(201).json({
      message: "Gestionnaire ajouté avec succès",
      gestionnaire: {
        id: savedGestionnaire._id,
        nom: savedGestionnaire.nom,
        email: savedGestionnaire.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});




module.exports = router;
