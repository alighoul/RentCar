const express = require("express");
const router = express.Router();
const Notification = require("../models/notification"); // Importer le modèle Notification

// Créer une notification
router.post("/", async (req, res) => {
  try {
    const { type, message } = req.body;
    const notification = await Notification.createNotification(type, message);
    res.status(201).json(notification);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Récupérer toutes les notifications
router.get("/", async (req, res) => {
  try {
    const notifications = await Notification.getNotifications();
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Supprimer une notification
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.deleteNotification(id);
    res.status(200).json(notification);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});
module.exports = router;
