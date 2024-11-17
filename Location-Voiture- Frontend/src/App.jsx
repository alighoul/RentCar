// src/App.jsx
import React from "react";
import { createBrowserRouter, RouterProvider, Route } from "react-router-dom";
import SignupForm from "./pages/SignUp";
import Login from "./pages/Login";
import Home from "./pages/Home";

const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  { path: "/signup", element: <SignupForm /> },
  { path: "/login", element: <Login /> },
  { path: "/home", element: <Home /> },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
