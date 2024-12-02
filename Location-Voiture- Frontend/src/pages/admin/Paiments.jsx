import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import CreditCard from "react-credit-cards";
import "react-credit-cards/es/styles-compiled.css";
import {
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from "@mui/material";

const Paiement = () => {
  const location = useLocation();
  const { reservationId } = location.state || {};
  const [total, setTotal] = useState(0);
  const [cardNumber, setCardNumber] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [billingCity, setBillingCity] = useState("");
  const [billingPostalCode, setBillingPostalCode] = useState("");
  const [cvc, setCvc] = useState("");
  const [expMonth, setExpMonth] = useState("");
  const [expYear, setExpYear] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchTotalCost = async (reservationId) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/reservation/total/${reservationId}`
      );
      setTotal(response.data.total);
    } catch (error) {
      setTotal(0);
    }
  };

  useEffect(() => {
    if (reservationId) {
      fetchTotalCost(reservationId);
    }
  }, [reservationId]);

  const validateCardNumber = (number) => {
    return /^\d{16}$/.test(number); // Ensures 16 digits
  };

  const validateCvc = (cvc) => {
    return /^\d{3}$/.test(cvc); // Ensures 3 digits
  };

  const validateExpDate = (month, year) => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100; // Get the last two digits of the year
    const currentMonth = currentDate.getMonth() + 1;
    if (month < 1 || month > 12) return false; // Invalid month
    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      return false; // Expired date
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    // Validate inputs
    if (paymentMethod === "carte") {
      if (!validateCardNumber(cardNumber)) {
        setMessage("Le numéro de carte doit comporter 16 chiffres.");
        setLoading(false);
        return;
      }
      if (!validateCvc(cvc)) {
        setMessage("Le CVC doit comporter 3 chiffres.");
        setLoading(false);
        return;
      }
      if (!validateExpDate(expMonth, expYear)) {
        setMessage("La date d'expiration est invalide.");
        setLoading(false);
        return;
      }
    }

    const paiementData = {
      reservationId: reservationId,
      montant: total,
      methodePaiement: paymentMethod === "carte" ? "Carte" : "Cash",
      ...(paymentMethod === "carte" && {
        cardNumber,
        cardholderName,
        billingAddress,
        billingCity,
        billingPostalCode,
        cvc,
        expMonth,
        expYear,
      }),
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/paiement/effectuerPaiement",
        paiementData
      );
      setMessage("Paiement effectué avec succès !");
      setLoading(false);
      navigate("/reservations");
    } catch (error) {
      setMessage("Erreur lors du paiement. Veuillez réessayer.");
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        margin: "50px auto",
        textAlign: "center",
        padding: 3,
        border: "1px solid #ddd",
        borderRadius: 2,
        backgroundColor: "#f9f9f9",
      }}
    >
      <Typography variant="h5" sx={{ color: "#333", marginBottom: 2 }}>
        Paiement
      </Typography>

      <Typography variant="h6" sx={{ marginBottom: 2, color: "green" }}>
        Montant à payer : {total > 0 ? `${total} DT` : "Calcul en cours..."}
      </Typography>

      <FormControl component="fieldset" sx={{ marginBottom: 2 }}>
        <RadioGroup
          row
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <FormControlLabel value="carte" control={<Radio />} label="Carte" />
          <FormControlLabel value="cash" control={<Radio />} label="Cash" />
        </RadioGroup>
      </FormControl>

      {paymentMethod === "carte" && (
        <form onSubmit={handleSubmit}>
          <Box sx={{ marginBottom: 2 }}>
            <CreditCard
              number={cardNumber}
              name={cardholderName}
              expiry={`${expMonth}/${expYear}`}
              focused="number"
            />
          </Box>

          <TextField
            label="Nom du titulaire"
            variant="outlined"
            fullWidth
            value={cardholderName}
            onChange={(e) => setCardholderName(e.target.value)}
            sx={{ marginBottom: 2 }}
            required
          />

          <TextField
            label="Numéro de la carte"
            variant="outlined"
            fullWidth
            value={cardNumber}
            onChange={(e) => {
              if (e.target.value.length <= 16) {
                setCardNumber(e.target.value);
              }
            }}
            sx={{ marginBottom: 2 }}
            required
          />

          <TextField
            label="CVC"
            variant="outlined"
            fullWidth
            value={cvc}
            onChange={(e) => {
              if (e.target.value.length <= 3) {
                setCvc(e.target.value);
              }
            }}
            sx={{ marginBottom: 2 }}
            required
          />

          <Box sx={{ marginBottom: 2, display: "flex", gap: 2 }}>
            <TextField
              label="MM"
              variant="outlined"
              value={expMonth}
              onChange={(e) => {
                if (e.target.value.length <= 3) {
                  setExpMonth(e.target.value);
                }
              }}
              sx={{ flex: 1 }}
              required
            />
            <TextField
              label="YY"
              variant="outlined"
              value={expYear}
              onChange={(e) => {
                if (e.target.value.length <= 2) {
                  setExpYear(e.target.value);
                }
              }}
              sx={{ flex: 1 }}
              required
            />
          </Box>

          <TextField
            label="Adresse de facturation"
            variant="outlined"
            fullWidth
            value={billingAddress}
            onChange={(e) => setBillingAddress(e.target.value)}
            sx={{ marginBottom: 2 }}
            required
          />

          <TextField
            label="Ville"
            variant="outlined"
            fullWidth
            value={billingCity}
            onChange={(e) => setBillingCity(e.target.value)}
            sx={{ marginBottom: 2 }}
            required
          />

          <TextField
            label="Code postal"
            variant="outlined"
            fullWidth
            value={billingPostalCode}
            onChange={(e) => setBillingPostalCode(e.target.value)}
            sx={{ marginBottom: 2 }}
            required
          />

          {message && (
            <Typography
              sx={{
                marginTop: 2,
                color: message.includes("succès") ? "green" : "red",
              }}
            >
              {message}
            </Typography>
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{ marginTop: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : "Payer"}
          </Button>
        </form>
      )}

      {paymentMethod === "cash" && (
        <Button
          onClick={handleSubmit}
          variant="contained"
          fullWidth
          disabled={loading}
          sx={{ marginTop: 2 }}
        >
          {loading ? <CircularProgress size={24} /> : "Payer en Cash"}
        </Button>
      )}
    </Box>
  );
};

export default Paiement;
