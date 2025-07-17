import React from "react";

const PayPalButton = ({ amount }) => {
  const handlePay = async () => {
    const token = localStorage.getItem("jwtToken");
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}paypal/create?amount=` + amount,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Errore nella creazione ordine PayPal");

      const approvalUrl = await response.text();

      window.location.href = approvalUrl;
    } catch (error) {
      console.error("Errore durante il pagamento con PayPal:", error);
      alert("Errore durante il pagamento");
    }
  };

  return (
    <button
      onClick={handlePay}
      className="btn btn-warning fs-5"
      style={{ fontFamily: "Hina Mincho, serif" }}
    >
      Paga con PayPal
    </button>
  );
};

export default PayPalButton;
