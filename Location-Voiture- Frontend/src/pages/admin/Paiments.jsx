import React, { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import axios from "axios";

const Paiments = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [paymentSuccessful, setPaymentSuccessful] = useState(false);

  // Champs d'informations supplémentaires
  const [cardholderName, setCardholderName] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [billingCity, setBillingCity] = useState("");
  const [billingPostalCode, setBillingPostalCode] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      setMessage("Stripe.js n'est pas encore chargé. Veuillez réessayer.");
      return;
    }

    // Validation des champs d'informations
    if (
      !cardholderName ||
      !billingAddress ||
      !billingCity ||
      !billingPostalCode
    ) {
      setMessage("Veuillez remplir tous les champs d'information.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      // Récupérer les détails de la carte de crédit
      const cardElement = elements.getElement(CardElement);

      if (!cardElement) {
        setMessage("Carte de crédit non valide.");
        setLoading(false);
        return;
      }

      // Créer un PaymentMethod avec Stripe
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
        billing_details: {
          name: cardholderName,
          address: {
            line1: billingAddress,
            city: billingCity,
            postal_code: billingPostalCode,
          },
        },
      });

      if (error) {
        setMessage(`Erreur lors de la création du paiement : ${error.message}`);
        setLoading(false);
        return;
      }

      // Simuler une demande à votre backend pour traiter le paiement
      const response = await axios.post("http://localhost:3000/payment", {
        paymentMethodId: paymentMethod.id,
        amount: 5000, // Exemple : Montant en centimes (50.00 DT)
      });

      if (response.data.success) {
        setMessage("Paiement réussi !");
        setPaymentSuccessful(true);
      } else {
        setMessage("Le paiement a échoué. Veuillez réessayer.");
      }
    } catch (error) {
      setMessage("Une erreur est survenue lors du paiement.");
      console.error(error);
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "50px auto",
        textAlign: "center",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        backgroundColor: "#f9f9f9",
      }}
    >
      <h2 style={{ color: "#333", marginBottom: "20px" }}>Paiement</h2>

      {!paymentSuccessful ? (
        <form onSubmit={handleSubmit}>
          {/* Nom du titulaire de la carte */}
          <div style={{ marginBottom: "15px" }}>
            <input
              type="text"
              placeholder="Nom du titulaire de la carte"
              value={cardholderName}
              onChange={(e) => setCardholderName(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                fontSize: "16px",
                borderRadius: "4px",
                border: "1px solid #ddd",
              }}
              required
            />
          </div>

          {/* Adresse de facturation */}
          <div style={{ marginBottom: "15px" }}>
            <input
              type="text"
              placeholder="Adresse de facturation"
              value={billingAddress}
              onChange={(e) => setBillingAddress(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                fontSize: "16px",
                borderRadius: "4px",
                border: "1px solid #ddd",
              }}
              required
            />
          </div>

          {/* Ville */}
          <div style={{ marginBottom: "15px" }}>
            <input
              type="text"
              placeholder="Ville"
              value={billingCity}
              onChange={(e) => setBillingCity(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                fontSize: "16px",
                borderRadius: "4px",
                border: "1px solid #ddd",
              }}
              required
            />
          </div>

          {/* Code postal */}
          <div style={{ marginBottom: "15px" }}>
            <input
              type="text"
              placeholder="Code postal"
              value={billingPostalCode}
              onChange={(e) => setBillingPostalCode(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                fontSize: "16px",
                borderRadius: "4px",
                border: "1px solid #ddd",
              }}
              required
            />
          </div>

          {/* Carte de crédit */}
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#424770",
                  "::placeholder": {
                    color: "#aab7c4",
                  },
                },
                invalid: {
                  color: "#9e2146",
                },
              },
            }}
          />
          <button
            type="submit"
            disabled={!stripe || loading}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              backgroundColor: "#6772e5",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            {loading ? "Traitement..." : "Payer"}
          </button>
        </form>
      ) : (
        <div>
          <h3 style={{ color: "green" }}>Merci pour votre paiement !</h3>
        </div>
      )}

      {message && (
        <p
          style={{
            marginTop: "20px",
            color: paymentSuccessful ? "green" : "red",
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default Paiments;
