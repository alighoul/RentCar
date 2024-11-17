const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const clientRouter = require("./routes/clientRoutes");
const reservationRouter = require("./routes/reservationRoutes");
const VehiculeRouter = require("./routes/vehiculeRoutes");
const paiementRouter = require("./routes/paiementRoutes");
const gestionnaireRoutes = require("./routes/gestionnaireRoutes");

const app = express();
const Server = http.createServer(app);
const port = process.env.PORT || 3000;

const DBurl =
  "mongodb+srv://guoolali:Admin@rentcar.uimdf.mongodb.net/?retryWrites=true&w=majority&appName=RentCar";

mongoose
  .connect(DBurl)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => console.error("Connection error: " + err));

app.use(cors());
app.use(express.json());
app.use("/client", clientRouter);
app.use("/reservation", reservationRouter);
app.use("/vehicule", VehiculeRouter);
app.use("/paiement", paiementRouter);
app.use("/gestionnaire", gestionnaireRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
