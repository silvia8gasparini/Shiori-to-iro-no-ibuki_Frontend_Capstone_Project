import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Alert,
  Spinner,
  ListGroup,
} from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import PayPalButton from "../components/PayPalButton";
import CustomNavbar from "../components/CustomNavbar";
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
          `${
            import.meta.env.VITE_API_BASE_URL
          }/paypal/capture?orderId=${orderId}`,
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
              <div>
                <ListGroup className="mb-4 checkout-font">
                  <ListGroup.Item>
                    <Row className="fw-bold">
                      <Col xs={8}>Articolo</Col>
                      <Col xs={4} className="text-end">
                        Prezzo
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  {cartItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col xs={8} className="text-start">
                          <strong>{item.title}</strong> di {item.author}
                        </Col>
                        <Col xs={4} className="text-end">
                          {item.price.toFixed(2)} €
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}

                  <ListGroup.Item>
                    <Row className="fw-bold">
                      <Col xs={8}>Totale</Col>
                      <Col xs={4} className="text-end">
                        {totalAmount} €
                      </Col>
                    </Row>
                  </ListGroup.Item>
                </ListGroup>

                <div className="text-center">
                  <PayPalButton amount={totalAmount} />
                </div>
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Checkout;
