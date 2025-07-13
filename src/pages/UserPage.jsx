import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchReservations,
  fetchFavorites,
  removeFavorite,
} from "../redux/userActions";
import { Container, Row, Col, Card, ListGroup, Button } from "react-bootstrap";
import { fetchUserCart } from "../redux/cartActions";
import CustomNavbar from "../components/CustomNavbar";
import CustomFooter from "../components/CustomFooter";
import "../assets/user.css";

const UserPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const cartItems = useSelector((state) => state.cart.items);
  const reservations = useSelector((state) => state.user.reservations);
  const favorites = useSelector((state) => state.user.favorites);

  useEffect(() => {
    if (user) {
      dispatch(fetchReservations());
      dispatch(fetchFavorites());
    }
  }, [dispatch, user]);
  console.log("Tutti i preferiti:", favorites);
  return (
    <div className="d-flex flex-column" style={{ minHeight: "100vh" }}>
      <CustomNavbar />
      <Container className="py-5">
        <header className="d-flex align-items-center justify-content-center gap-3 mb-5">
          {user && <h2>Benvenutə nel tuo spazio personale, {user.name}!</h2>}{" "}
          <img
            src="/public/img/navbar-icons/kitsune.png"
            alt="kitsune"
            width="50"
          />
        </header>

        <div className="d-flex align-align-items-center justify-content-center">
          <Row className="d-flex justify-content-center g-5">
            {/* Carrello */}
            <Col xs={12} md={4} lg={4}>
              <Card className="user-card">
                <Card.Img variant="top" src="/public/img/user/cart.png" />
                <Card.Body>
                  {cartItems.length === 0 ? (
                    <p className="text-muted">Il carrello è vuoto</p>
                  ) : (
                    <>
                      <ListGroup>
                        {cartItems.map((item) => (
                          <ListGroup.Item
                            key={item.id}
                            className="d-flex justify-content-between align-items-center text-start text-wrap"
                          >
                            <div
                              style={{
                                maxWidth: "180px",
                                wordBreak: "break-word",
                              }}
                            >
                              <span>
                                <b>{item.title}</b> - {item.author}
                                {item.quantity > 1 && ` ×${item.quantity}`}
                              </span>
                            </div>
                            <div className="d-flex align-items-center gap-1">
                              <span
                                style={{
                                  whiteSpace: "nowrap",
                                  fontSize: "1rem",
                                }}
                              >
                                {(item.price * item.quantity).toFixed(2)} €
                              </span>
                              <button
                                onClick={() => {
                                  const token =
                                    localStorage.getItem("jwtToken");
                                  fetch(
                                    `http://localhost:8080/cart-items/${item.id}`,
                                    {
                                      method: "DELETE",
                                      headers: {
                                        Authorization: `Bearer ${token}`,
                                      },
                                    }
                                  )
                                    .then((res) => {
                                      if (!res.ok)
                                        throw new Error(
                                          "Errore nella rimozione"
                                        );
                                      dispatch(fetchUserCart());
                                    })
                                    .catch((err) =>
                                      console.error("Errore:", err)
                                    );
                                }}
                                className="btn btn-sm p-0 border-0 bg-transparent d-flex align-items-center"
                                title="Rimuovi dal carrello"
                              >
                                <img
                                  src="/img/navbar-icons/bin.png"
                                  alt="Rimuovi"
                                  height="17"
                                  className="ms-2"
                                />
                              </button>
                            </div>
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                      <div className="total px-3 py-2">
                        Totale:{" "}
                        {cartItems
                          .reduce(
                            (sum, item) => sum + item.price * item.quantity,
                            0
                          )
                          .toFixed(2)}{" "}
                        €
                        <Button
                          variant="outline-dark"
                          size="sm"
                          className="w-100 mt-2"
                          onClick={() => navigate("/checkout")}
                        >
                          Paga
                        </Button>
                      </div>
                    </>
                  )}
                </Card.Body>
              </Card>
            </Col>

            {/* Prenotazioni */}
            <Col xs={12} md={4} lg={4}>
              <Card className="user-card">
                <Card.Img variant="top" src="/public/img/user/card.png" />
                <Card.Body>
                  {user && user.digitalCard && (
                    <p className="digital-card text-muted mb-3">
                      Tessera digitale n° <strong>{user.digitalCard}</strong>
                    </p>
                  )}
                  {reservations.length === 0 ? (
                    <p className="text-muted">Nessuna prenotazione attiva</p>
                  ) : (
                    <ListGroup>
                      {reservations.map((res) => (
                        <ListGroup.Item key={res.id}>
                          Zona: <strong>{res.zone.name}</strong> – {res.date} (
                          {res.timeSlot})
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  )}
                </Card.Body>
              </Card>
            </Col>

            {/* Preferiti */}
            <Col xs={12} md={4} lg={4}>
              <Card className="user-card">
                <Card.Img variant="top" src="/public/img/user/fav.png" />
                <Card.Body>
                  {favorites.length === 0 ? (
                    <p className="text-muted">Nessun preferito</p>
                  ) : (
                    <ListGroup>
                      {favorites.map((book) => (
                        <ListGroup.Item
                          key={book.bookId}
                          className="d-flex justify-content-between align-items-center"
                        >
                          <div className="d-flex align-items-center justify-content-between w-100">
                            <div>
                              <strong>{book.title}</strong>{" "}
                              <span>- {book.author}</span>
                              <img
                                src="/img/navbar-icons/bin.png"
                                alt="Rimuovi"
                                height="20"
                                className="bin-icon ms-2"
                                onClick={() => {
                                  console.log("CLICK SU:", book);
                                  dispatch(removeFavorite(book.bookId));
                                }}
                              />
                            </div>
                          </div>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
      </Container>
      <CustomFooter />
    </div>
  );
};

export default UserPage;
