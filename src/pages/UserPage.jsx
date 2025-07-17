import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchReservations,
  fetchFavorites,
  fetchBorrows,
  removeFavorite,
  removeReservation,
} from "../redux/userActions";
import {
  Container,
  Row,
  Col,
  Card,
  ListGroup,
  Button,
  Toast,
  ToastContainer,
} from "react-bootstrap";
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
  const [showConfirmToast, setShowConfirmToast] = useState(false);
  const [reservationToDelete, setReservationToDelete] = useState(null);
  const borrows = useSelector((state) => state.user.borrows);

  useEffect(() => {
    if (user) {
      dispatch(fetchReservations());
      dispatch(fetchFavorites());
      dispatch(fetchBorrows());
    }
  }, [dispatch, user]);

  return (
    <div className="d-flex flex-column" style={{ minHeight: "100vh" }}>
      <CustomNavbar />
      <Container className="py-5">
        <header className="user-welcome d-flex align-items-center justify-content-center gap-3 mb-5 mx-3">
          {user && <h2>Benvenutə nel tuo spazio personale, {user.name}!</h2>}{" "}
          <img
            src="/img/navbar-icons/kitsune.png"
            alt="kitsune"
            width="50"
            className="kitsune"
          />
        </header>

        <Row className="justify-content-center">
          {/* Prenotazioni */}
          <Col xs={12} md={4} lg={4}>
            <Card className="user-card">
              <Card.Img variant="top" src="/img/user/card.png" />
              <Card.Body>
                {user?.digitalCard && (
                  <p className="digital-card mb-3">
                    Tessera digitale n°{" "}
                    <strong>{user.digitalCard.cardNumber}</strong>
                  </p>
                )}

                {/* Sezione Prenotazioni */}
                <p className="mb-2 mt-3 d-flex align-items-center justify-content-center gap-2">
                  <img
                    src="/img/tearoom/herbal-tea.png"
                    alt="tea"
                    height="25"
                  />
                  Prenotazioni
                </p>
                {reservations.length === 0 ? (
                  <p className="text-muted text-center">
                    Nessuna prenotazione attiva
                  </p>
                ) : (
                  <ListGroup className="mb-3">
                    {reservations.map((res) => (
                      <ListGroup.Item key={`res-${res.id}`}>
                        <strong>{res.tearoomZone?.name}</strong> – {res.date} (
                        {res.timeSlot.toLowerCase()})
                        <img
                          src="/img/navbar-icons/bin.png"
                          alt="Rimuovi"
                          height="20"
                          className="bin-icon ms-2"
                          onClick={() => {
                            setReservationToDelete(res.id);
                            setShowConfirmToast(true);
                          }}
                        />
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}

                {/* Sezione Prestiti */}
                <p className="mb-2 mt-4 d-flex align-items-center justify-content-center gap-2">
                  <img
                    src="/img/books-icons/books.png"
                    alt="books"
                    height="25"
                  />
                  Prestiti
                </p>
                {borrows.length === 0 ? (
                  <p className="text-muted text-center">
                    Nessun prestito attivo
                  </p>
                ) : (
                  <ListGroup>
                    {borrows.map((b) => (
                      <ListGroup.Item key={`borrow-${b.id}`}>
                        <div className="d-flex justify-content-between align-items-start gap-4">
                          <div>
                            <strong>{b.bookTitle}</strong> –{" "}
                            <span className="text-muted">
                              Scadenza: {b.dueDate}
                              {b.returned && (
                                <span className="text-success ms-2">
                                  (restituito)
                                </span>
                              )}
                              {!b.returned &&
                                new Date(b.dueDate) < new Date() && (
                                  <span className="text-danger ms-2">
                                    (in ritardo)
                                  </span>
                                )}
                            </span>
                          </div>
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}
              </Card.Body>
            </Card>
          </Col>

          {/* Carrello */}
          <Col xs={12} md={4} lg={4}>
            <Card className="user-card">
              <Card.Img variant="top" src="/img/user/cart.png" />
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
                                const token = localStorage.getItem("jwtToken");
                                fetch(
                                  `${
                                    import.meta.env.VITE_API_BASE_URL
                                  }cart-items/${item.id}`,
                                  {
                                    method: "DELETE",
                                    headers: {
                                      Authorization: `Bearer ${token}`,
                                    },
                                  }
                                )
                                  .then((res) => {
                                    if (!res.ok)
                                      throw new Error("Errore nella rimozione");
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

          {/* Preferiti */}
          <Col xs={12} md={4} lg={4}>
            <Card className="user-card">
              <Card.Img variant="top" src="/img/user/fav.png" />
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
                            <img
                              src="/img/user-icons/heart.png"
                              alt="Rimuovi"
                              height="20"
                              className="bin-icon me-2"
                              onClick={() => {
                                console.log("CLICK SU:", book);
                                dispatch(removeFavorite(book.bookId));
                              }}
                            />
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
      </Container>

      <ToastContainer
        className="position-fixed top-50 start-50 translate-middle p-3"
        style={{ zIndex: 1055 }}
      >
        <Toast
          onClose={() => setShowConfirmToast(false)}
          show={showConfirmToast}
          delay={null}
          autohide={false}
          bg="light"
          className="text-center"
        >
          <Toast.Header closeButton={false}>
            <strong className="me-auto text-dark fs-4">
              Sei sicurə di voler cancellare la prenotazione?
            </strong>
          </Toast.Header>
          <Toast.Body>
            <img
              src="/img/neko-thor2.png"
              alt="fat-cat"
              style={{ width: "320px" }}
            />
            <Button
              variant="outline-danger"
              className="me-4 mt-3 fs-5"
              onClick={() => {
                dispatch(removeReservation(reservationToDelete));
                setShowConfirmToast(false);
                setReservationToDelete(null);
              }}
            >
              Sì, cancella
            </Button>
            <Button
              className="mt-3 fs-5"
              variant="outline-secondary"
              onClick={() => setShowConfirmToast(false)}
            >
              Annulla
            </Button>
          </Toast.Body>
        </Toast>
      </ToastContainer>
      <CustomFooter />
    </div>
  );
};

export default UserPage;
