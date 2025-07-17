import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import ReservationCalendar from "../components/ReservationCalendar";
import CustomNavbar from "../components/CustomNavbar";
import CustomFooter from "../components/CustomFooter";
import { createReservation } from "../redux/userActions";
import "../assets/tearoom.css";

const zone = [
  {
    id: 1,
    name: "Area Before Sunrise",
    icon: "/img/tearoom/sunset1.png",
    imageUrl: "/img/tearoom/beforesunrise.png",
  },
  {
    id: 2,
    name: "Area Tomodachi",
    icon: "/img/tearoom/friends.png",
    imageUrl: "/img/tearoom/tomodachi.png",
  },
  {
    id: 3,
    name: "Area Giyu",
    icon: "/img/tearoom/wave.png",
    imageUrl: "/img/tearoom/introvert.png",
  },
  {
    id: 4,
    name: "Area Komori",
    icon: "/img/tearoom/autumn.png",
    imageUrl: "/img/tearoom/komori.png",
  },
];

const Tearoom = () => {
  const dispatch = useDispatch();
  const [zonaSelezionata, setZonaSelezionata] = useState(null);
  const [prenotazioniZona, setPrenotazioniZona] = useState([]);
  const [prenotazione, setPrenotazione] = useState(null);
  const [showConferma, setShowConferma] = useState(false);

  useEffect(() => {
    if (zonaSelezionata) {
      const token = localStorage.getItem("jwtToken");
      fetch(`http://localhost:8080/reservations/by-zone/${zonaSelezionata}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setPrenotazioniZona(data);
        })
        .catch((err) =>
          console.error("Errore nel caricamento prenotazioni:", err)
        );
    }
  }, [zonaSelezionata]);

  const handlePrenotazione = (slot) => {
    setPrenotazione({ zona: zonaSelezionata, ...slot });
    dispatch(createReservation(slot, zonaSelezionata));

    setPrenotazioniZona((prev) => [
      ...prev,
      { ...slot, timeSlot: slot.timeSlot.toUpperCase() },
    ]);

    setShowConferma(true);
    setTimeout(() => setShowConferma(false), 3000);
  };

  return (
    <div className="d-flex flex-column" style={{ minHeight: "100vh" }}>
      <CustomNavbar />
      <Container className="mt-5">
        <div className="d-flex justify-content-center gap-3">
          <h2 className="mb-4 text-center">Scegli la tua area!</h2>
          <img src="/img/tearoom/tea.png" alt="tea" className="tea-icon" />
        </div>

        <Row className="g-4 justify-content-center">
          {zone.map((zona) => (
            <Col key={zona.id} xs={12} md={6} lg={3}>
              <Card className="text-center shadow-sm h-100 fade-in">
                <Card.Img variant="top" src={zona.imageUrl} />
                <Card.Body>
                  <Card.Title className="d-flex align-items-center justify-content-center gap-2 mt-1">
                    <img
                      src={zona.icon}
                      alt="icona zona"
                      style={{ height: "35px" }}
                    />
                    {zona.name}
                  </Card.Title>
                  <Button
                    className="my-2"
                    variant="outline-dark"
                    style={{ padding: "10px 24px", fontSize: "1.4rem" }}
                    onClick={() => setZonaSelezionata(zona.id)}
                  >
                    Seleziona
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        <div className="d-flex justify-content-center mt-4 gap-3">
          <h3 className="mb-4 text-center">Tutte le aree sono pet friendly!</h3>
          <img src="/img/tearoom/pet.png" alt="pet" className="pet-icon" />
        </div>

        {zonaSelezionata && (
          <>
            <div className="d-flex justify-content-center mt-3 gap-2">
              <img
                src="/img/tearoom/schedule.png"
                alt="schedule"
                className="schedule-icon"
              />
              <h3 className="mt-3 text-center">
                Prenota giorno e fascia oraria
              </h3>
            </div>
            <ReservationCalendar
              onPrenota={handlePrenotazione}
              prenotazioni={prenotazioniZona}
            />
          </>
        )}
        <Row>
          <Col md={12}>
            {showConferma && prenotazione && (
              <div className="prenotation alert alert-success text-center mt-4 fs-4">
                Prenotazione confermata!
                <p>
                  {zone.find((z) => z.id === prenotazione.zona)?.name}{" "}
                  {prenotazione.date} {prenotazione.timeSlot.toLowerCase()}
                </p>
              </div>
            )}
          </Col>
        </Row>
      </Container>
      <CustomFooter />
    </div>
  );
};

export default Tearoom;
