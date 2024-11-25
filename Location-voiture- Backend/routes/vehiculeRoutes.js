const express = require("express");
const router = express.Router();
const Vehicule = require("../models/Vehicule");

// Import des modules nécessaires pour Cloudinary et multer
const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Configuration de Cloudinary
// Configuration de Cloudinary
cloudinary.config({
  cloud_name: "dmyv5xkhy", // Il manque les guillemets autour du cloud_name
  api_key: "718327744974918",
  api_secret: "vuzY9YLXhmWtvMMmaQ1BWN0AVFg",
});

// Configuration de multer pour utiliser Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "RentCar", // Dossier dans Cloudinary
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const upload = multer({ storage });

// Route pour ajouter un nouveau véhicule avec upload d'images
router.post("/add", upload.single("image"), async (req, res) => {
  const { marque, modele, prixJournalier } = req.body;

  // Vérification de la présence des fichiers et des données
  if (!req.file) {
    return res.status(400).json({ message: "Veuillez télécharger une image." });
  }

  if (!marque || !modele || !prixJournalier) {
    return res
      .status(400)
      .json({ message: "Tous les champs doivent être remplis." });
  }

  try {
    const imageUrl = req.file.path; // Récupère le chemin de l'image stockée sur Cloudinary

    // Création du nouveau véhicule
    const nouveauVehicule = new Vehicule({
      marque,
      modele,
      prixJournalier,
      images: [imageUrl], // Si vous n'attendez qu'une seule image
    });

    // Sauvegarde du véhicule dans la base de données
    const resultat = await nouveauVehicule.save();

    // Réponse avec le véhicule ajouté
    res.status(201).json(resultat);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        message: "Erreur lors de l'ajout du véhicule",
        error: error.message,
      });
  }
});

// Route pour récupérer tous les véhicules
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

// Route pour récupérer un véhicule par ID
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

// Route pour mettre à jour un véhicule
router.put("/update/:id", upload.array("images", 5), async (req, res) => {
  try {
    const { marque, modele, prixJournalier } = req.body;
    let images = req.body.images || []; // Images existantes
    if (req.files) {
      const uploadedImages = req.files.map((file) => file.path);
      images = images.concat(uploadedImages); // Combine les images existantes et nouvelles
    }

    const vehicule = await Vehicule.findByIdAndUpdate(
      req.params.id,
      { marque, modele, prixJournalier, images },
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

// Route pour supprimer un véhicule
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

// Route pour récupérer les marques disponibles
router.get("/marques", async (req, res) => {
  try {
    const marques = await Vehicule.distinct("marque");
    res.status(200).json(marques);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des marques", error });
  }
});

// Route pour récupérer les modèles disponibles
router.get("/modeles", async (req, res) => {
  try {
    const modeles = await Vehicule.distinct("modele");
    res.status(200).json(modeles);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des modèles", error });
  }
});

// Route pour filtrer les véhicules par disponibilité et prix
router.get("/available", async (req, res) => {
  try {
    const { marque, modele, prixMin, prixMax } = req.query;

    const query = {};
    if (marque) query.marque = marque;
    if (modele) query.modele = modele;
    if (prixMin) query.prixJournalier = { $gte: parseFloat(prixMin) };
    if (prixMax) query.prixJournalier = { $lte: parseFloat(prixMax) };

    const vehicles = await Vehicule.find(query);
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({
      error: "Erreur lors de la récupération des véhicules disponibles",
    });
  }
});

module.exports = router;
