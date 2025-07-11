import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCartItems,
  fetchReservations,
  fetchFavorites,
} from "../redux/userActions";
import { Container, Row, Col, Card, ListGroup, Badge } from "react-bootstrap";
import CustomNavbar from "../components/CustomNavbar";
import CustomFooter from "../components/CustomFooter";

const UserPage = () => {
  const dispatch = useDispatch();
  const { user, cart, reservations, favorites } = useSelector(
    (state) => state.user
  );

  useEffect(() => {
    if (user) {
      dispatch(fetchCartItems(user.id));
      dispatch(fetchReservations(user.id));
      dispatch(fetchFavorites(user.id));
    }
  }, [dispatch, user]);

  return (
    <div className="d-flex flex-column" style={{ minHeight: "100vh" }}>
      <CustomNavbar />
      <Container className="py-5">
        <header className="d-flex align-items-center justify-content-center gap-3 mb-5">
          <h2>Benvenutə nel tuo spazio personale, {user?.name}!</h2>
          <img
            src="/public/img/navbar-icons/kitsune.png"
            alt="kitsune"
            width="50"
          />
        </header>

        <div className="d-flex justify-content-center">
          <Row className="d-flex justify-content-center g-5">
            {/* Carrello */}
            <Col xs={12} md={4} lg={4}>
              <Card className="user-card">
                <Card.Img variant="top" src="/public/img/user/cart.png" />
                <Card.Body>
                  {cart.length === 0 ? (
                    <p className="text-muted">Il carrello è vuoto</p>
                  ) : (
                    <ListGroup variant="flush">
                      {cart.map((item) => (
                        <ListGroup.Item
                          key={item.id}
                          className="d-flex justify-content-between align-items-center"
                        >
                          {item.title}
                          <Badge bg="success">€{item.price.toFixed(2)}</Badge>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  )}
                </Card.Body>
              </Card>
            </Col>

            {/* Prenotazioni */}
            <Col xs={12} md={4} lg={4}>
              <Card className="user-card">
                <Card.Img variant="top" src="/public/img/user/card.png" />
                <Card.Body>
                  {reservations.length === 0 ? (
                    <p className="text-muted">Nessuna prenotazione attiva</p>
                  ) : (
                    <ListGroup variant="flush">
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
                <Card.Img variant="top" src="/public/img/user/favorites.png" />
                <Card.Body>
                  {favorites.length === 0 ? (
                    <p className="text-muted">Nessun preferito</p>
                  ) : (
                    <Row xs={1} md={3} className="g-4">
                      {favorites.map((book) => (
                        <Col key={book.id}>
                          <Card className="h-100">
                            <Card.Img
                              variant="top"
                              src={book.imageUrl}
                              alt={book.title}
                            />
                            <Card.Body className="d-flex flex-column">
                              <Card.Title>{book.title}</Card.Title>
                              <Card.Text className="text-muted">
                                {book.author}
                              </Card.Text>
                              <Badge
                                bg="info"
                                className="mt-auto align-self-start"
                              >
                                €{book.price.toFixed(2)}
                              </Badge>
                            </Card.Body>
                          </Card>
                        </Col>
                      ))}
                    </Row>
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
