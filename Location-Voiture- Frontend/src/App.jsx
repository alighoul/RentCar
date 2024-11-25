import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import SignupForm from "./pages/SignUp";
import Login from "./pages/Login";
import Home from "./pages/Home";
import HomeAdmin from "./pages/admin/HomeAdmin";
import Reservations from "./pages/reservations";
import Paiments from "./pages/admin/Paiments";
import GenerateContract from "./components/GenerateContract";
import AdminLayout from "./layouts/AdminLayout";
import UserLayout from "./layouts/UserLayout"; // Nouveau layout
import AllReservations from "./pages/admin/AllReservation";

// Charger la clé publique Stripe
const stripePromise = loadStripe("pk_test_12345"); // Remplacez par votre clé publique Stripe

// Configuration des routes
const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  { path: "/signup", element: <SignupForm /> },
  { path: "/login", element: <Login /> },
  { path: "contrat", element: <GenerateContract /> },
  {
    path: "/",
    element: <UserLayout />, // Layout utilisateur
    children: [
      { path: "home", element: <Home /> },
      { path: "reservations", element: <Reservations /> },
    ],
  },
  {
    path: "/paiment",
    element: (
      <Elements stripe={stripePromise}>
        <Paiments />
      </Elements>
    ),
  },
  {
    path: "/admin",
    element: <AdminLayout />, // Layout admin
    children: [
      { path: "home", element: <HomeAdmin /> },
      { path: "paiments", element: <Paiments /> },
      { path: "reservation", element: <AllReservations /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
