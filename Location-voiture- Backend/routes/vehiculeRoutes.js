const express = require("express");
const router = express.Router();
const Vehicule = require("../models/Vehicule");

// Chemin pour ajouter un nouveau véhicule
router.post("/add", async (req, res) => {
  const { id, marque, modele, prixJournalier, images } = req.body;

  try {
    const nouveauVehicule = new Vehicule({
      id,
      marque,
      modele,
      prixJournalier,
      images,
    });

    const resultat = await nouveauVehicule.save();
    res.status(201).json(resultat);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Erreur lors de l'ajout du véhicule", error });
  }
});

// Chemin pour récupérer tous les véhicules
router.get("/all", async (req, res) => {
  try {
    const vehicules = await Vehicule.find();
    res.status(200).json(vehicules);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des véhicules", error });
  }
});

// Chemin pour récupérer un véhicule par ID
router.get("/get/:id", async (req, res) => {
  try {
    const vehicule = await Vehicule.findById(req.params.id);
    if (!vehicule)
      return res.status(404).json({ message: "Véhicule non trouvé" });
    res.status(200).json(vehicule);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération du véhicule", error });
  }
});

// Chemin pour mettre à jour un véhicule
router.put("/update/:id", async (req, res) => {
  try {
    const vehicule = await Vehicule.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    );

    if (!vehicule)
      return res.status(404).json({ message: "Véhicule non trouvé" });
    res.status(200).json(vehicule);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Erreur lors de la mise à jour du véhicule", error });
  }
});

// Chemin pour supprimer un véhicule
router.delete("/delete/:id", async (req, res) => {
  try {
    const vehicule = await Vehicule.findByIdAndDelete(req.params.id);
    if (!vehicule)
      return res.status(404).json({ message: "Véhicule non trouvé" });
    res.status(200).json({ message: "Véhicule supprimé avec succès" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la suppression du véhicule", error });
  }
});

// In your vehiculeRoutes.js, adjust the endpoint for filtering

router.get("/available", async (req, res) => {
  try {
    const { marque, modele, prixMin, prixMax } = req.query;

    // Build query dynamically based on provided filters
    const query = {};
    if (marque) query.marque = marque;
    if (modele) query.modele = modele;
    if (prixMin) query.prixJournalier = { $gte: parseFloat(prixMin) };
    if (prixMax) query.prixJournalier = { $lte: parseFloat(prixMax) };

    const vehicles = await Vehicule.find(query);
    res.json(vehicles);
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    res.status(500).json({ error: "Error fetching vehicles" });
  }
});

// Route to fetch distinct marques
router.get("/marques", async (req, res) => {
  try {
    const marques = await Vehicule.distinct("marque");
    res.status(200).json(marques);
  } catch (error) {
    res.status(500).json({ message: "Error fetching marques", error });
  }
});

// Route to fetch distinct modeles
router.get("/modeles", async (req, res) => {
  try {
    const modeles = await Vehicule.distinct("modele");
    res.status(200).json(modeles);
  } catch (error) {
    res.status(500).json({ message: "Error fetching modeles", error });
  }
});

module.exports = router;
