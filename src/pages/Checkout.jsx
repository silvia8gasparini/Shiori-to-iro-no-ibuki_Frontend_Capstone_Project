import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import PayPalButton from "../components/PayPalButton";
import { Link, useSearchParams } from "react-router-dom";
import CustomNavbar from "../components/CustomNavbar";
import { Container, Row, Col, Alert, Spinner } from "react-bootstrap";
import { clearCart } from "../redux/Cartslice";
import "../assets/paypal.css";

const Checkout = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();

  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("token");
  const [paymentStatus, setPaymentStatus] = useState(null);

  const totalAmount = cartItems
    .reduce((sum, item) => sum + item.price, 0)
    .toFixed(2);

  useEffect(() => {
    const captureOrder = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        const response = await fetch(
          `http://localhost:8080/paypal/capture?orderId=${orderId}`,
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
        dispatch(clearCart());

        // TODO: opzionale — svuotare anche il carrello nel backend
        // await fetch("http://localhost:8080/cart/clear", { method: "POST", headers: { Authorization: `Bearer ${token}` } });

        setPaymentStatus("success");
      } catch (error) {
        console.error("Errore durante la cattura dell'ordine:", error);
        setPaymentStatus("error");
      }
    };

    if (orderId) {
      captureOrder();
    }
  }, [orderId, dispatch]);

  return (
    <div className="d-flex flex-column" style={{ minHeight: "100vh" }}>
      <CustomNavbar />
      <Container className="my-5">
        <Row className="justify-content-center">
          <Col xs={12} md={10} lg={6}>
            <h2 className="mb-4 text-center">Checkout</h2>

            {paymentStatus === "success" && (
              <Alert variant="success" className="text-center fs-4">
                Grazie per il tuo acquisto! Il pagamento è stato completato con
                successo.
              </Alert>
            )}

            {paymentStatus === "error" && (
              <Alert variant="danger" className="text-center fs-4">
                Si è verificato un errore durante il pagamento. Riprova o
                contattaci.
              </Alert>
            )}

            {orderId && !paymentStatus && (
              <div className="text-center">
                <Spinner animation="border" role="status" />
                <p className="mt-2">Conferma del pagamento in corso...</p>
              </div>
            )}

            {!orderId && cartItems.length === 0 && (
              <div className="alert alert-warning text-center">
                Il tuo carrello è vuoto. <Link to="/shop">Torna allo shop</Link>
              </div>
            )}

            {!orderId && cartItems.length > 0 && (
              <>
                <ul className="list-group mb-4 checkout-font">
                  {cartItems.map((item, index) => (
                    <li
                      key={index}
                      className="list-group-item d-flex justify-content-between"
                    >
                      <div>
                        <strong>{item.title}</strong> di {item.author}
                      </div>
                      <div className="checkout-font">
                        {item.price.toFixed(2)} €
                      </div>
                    </li>
                  ))}
                  <li className="list-group-item d-flex justify-content-between">
                    <strong>Totale</strong>
                    <strong>{totalAmount} €</strong>
                  </li>
                </ul>

                <div className="text-center">
                  <PayPalButton amount={totalAmount} />
                </div>
              </>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Checkout;
