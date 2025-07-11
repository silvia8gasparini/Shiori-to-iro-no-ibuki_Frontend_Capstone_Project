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
        <header className="text-center mb-5">
          <h2 className="fw-bold">Benvenuto, {user?.name}!</h2>
        </header>

        <Row className="gy-5">
          {/* Carrello */}
          <Col xs={12}>
            <Card border="primary">
              <Card.Header className="bg-primary text-white">
                Il tuo carrello
              </Card.Header>
              <Card.Body>
                {cart.length === 0 ? (
                  <p className="text-muted">Il carrello è vuoto.</p>
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
          <Col xs={12}>
            <Card border="success">
              <Card.Header className="bg-success text-white">
                Le tue prenotazioni
              </Card.Header>
              <Card.Body>
                {reservations.length === 0 ? (
                  <p className="text-muted">Nessuna prenotazione attiva.</p>
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
          <Col xs={12}>
            <Card border="warning">
              <Card.Header className="bg-warning text-dark">
                I tuoi preferiti
              </Card.Header>
              <Card.Body>
                {favorites.length === 0 ? (
                  <p className="text-muted">Nessun preferito ancora.</p>
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
      </Container>
      <CustomFooter />
    </div>
  );
};

export default UserPage;
