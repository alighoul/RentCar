// src/App.jsx
import React from "react";
import { createBrowserRouter, RouterProvider, Route } from "react-router-dom";
import SignupForm from "./pages/SignUp";
import Login from "./pages/Login";
import Home from "./pages/Home";
import HomeAdmin from "./pages/admin/HomeAdmin";
import Reservations from "./pages/reservations";

const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  { path: "/signup", element: <SignupForm /> },
  { path: "/login", element: <Login /> },
  { path: "/home", element: <Home /> },
  { path: "/adminhome", element: <HomeAdmin /> },
  { path: "/reservations", element: <Reservations /> },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
