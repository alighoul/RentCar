const mongoose = require("mongoose");

// Définir le schéma de la notification
const notificationSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ["info", "warning", "error", "success"], // Types de notifications possibles
  },
  message: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// Créer un modèle de notification
const Notification = mongoose.model("Notification", notificationSchema);

// Fonction pour créer une notification
Notification.createNotification = async function (type, message) {
  try {
    const newNotification = new this({ type, message });
    await newNotification.save();
    return newNotification;
  } catch (error) {
    throw new Error(
      "Erreur lors de la création de la notification: " + error.message
    );
  }
};

// Fonction pour récupérer toutes les notifications
Notification.getNotifications = async function () {
  try {
    const notifications = await this.find().sort({ date: -1 });
    return notifications;
  } catch (error) {
    throw new Error(
      "Erreur lors de la récupération des notifications: " + error.message
    );
  }
};

// Fonction pour supprimer une notification par ID
Notification.deleteNotification = async function (id) {
  try {
    const notification = await this.findByIdAndDelete(id);
    if (!notification) {
      throw new Error("Notification non trouvée");
    }
    return notification;
  } catch (error) {
    throw new Error(
      "Erreur lors de la suppression de la notification: " + error.message
    );
  }
};

module.exports = Notification;
