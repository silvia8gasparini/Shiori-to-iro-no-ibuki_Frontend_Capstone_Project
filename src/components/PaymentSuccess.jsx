import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("token");

  useEffect(() => {
    const captureOrder = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        const response = await fetch(
          `${
            import.meta.env.VITE_API_BASE_URL
          }paypal/capture?orderId=${orderId}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Errore nella cattura dell'ordine");

        const orderData = await response.json();
        console.log("Ordine catturato:", orderData);
      } catch (error) {
        console.error("Errore durante la cattura dell'ordine:", error);
      }
    };

    if (orderId) {
      captureOrder();
    }
  }, [orderId]);

  return (
    <div className="container text-center mt-5">
      <h2>Grazie per il tuo acquisto!</h2>
      <p>Il pagamento è stato completato con successo.</p>
    </div>
  );
};

export default PaymentSuccess;
