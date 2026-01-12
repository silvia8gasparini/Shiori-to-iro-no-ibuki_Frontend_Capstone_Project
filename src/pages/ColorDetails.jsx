import { useSelector } from "react-redux";
import { Container, Row, Col, Card } from "react-bootstrap";
import CustomNavbar from "../components/CustomNavbar";
import CustomFooter from "../components/CustomFooter";
import "bootstrap/dist/css/bootstrap.min.css";
import "../assets/colorSection.css";

function isDark(rgbString) {
  const rgb = rgbString
    .replace(/[^\d,]/g, "")
    .split(",")
    .map(Number);
  const brightness = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
  return brightness < 128;
}

export default function ColorDetails() {
  const selectedColor = useSelector(
    (state) => state.selectedColor.selectedColor
  );

  if (!selectedColor) {
    return (
      <div className="d-flex flex-column" style={{ minHeight: "100vh" }}>
        <CustomNavbar />
        <Container className="flex-grow-1 text-center mt-5">
          <p>Colore non disponibile</p>
        </Container>
        <CustomFooter />
      </div>
    );
  }

  const textColor = isDark(selectedColor.rgb) ? "white" : "black";

  return (
    <div className="d-flex flex-column" style={{ minHeight: "100vh" }}>
      <CustomNavbar />

      <Container fluid className="color-section px-0 mt-1">
        <Row className="g-0 w-100 h-100">
          <Col md={6} className="color-image-col d-flex justify-content-center">
            <img
              src={selectedColor.imageUrl}
              alt={selectedColor.italianName}
              className="img-fluid"
              style={{ maxHeight: "100vh", objectFit: "cover" }}
            />
          </Col>
          <Col
            md={6}
            className="d-flex flex-column justify-content-center align-items-center color-text-col"
            style={{
              backgroundColor: selectedColor.rgb,
              color: textColor,
              textAlign: "center",
            }}
          >
            <h1 className="kanji mb-2">{selectedColor.japaneseName}</h1>
            <h3 className="translation">{selectedColor.italianName}</h3>
          </Col>
        </Row>
      </Container>

      <Container className="mt-5 mb-5">
        <div className="d-flex justify-content-center gap-3">
          <h3 className="details-title mb-5 text-center">Dettagli colore</h3>
          <img
            src="/img/colors-icons/paint.png"
            alt="paint"
            className="paint-icon"
          />
        </div>

        <Row className="mb-4">
          <Col md={6}>
            <Card
              className="info-card fade-down-cascade fade-delay-1"
              style={{
                border: `3px solid ${selectedColor.rgb}`,
                borderRadius: "15px",
              }}
            >
              <Card.Body>
                <div className="d-flex justify-content-center align-items-center gap-2 mb-2">
                  <strong className="fs-4">RGB</strong>
                  <img
                    src="/img/colors-icons/wheel.png"
                    alt="wheel"
                    className="details-icon"
                  />
                </div>
                <p className="color-p">{selectedColor.rgb}</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mb-4 justify-content-end">
          <Col md={6}>
            <Card
              className="info-card fade-down-cascade fade-delay-2"
              style={{
                border: `3px solid ${selectedColor.rgb}`,
                borderRadius: "15px",
              }}
            >
              <Card.Body className="text-center">
                <div className="d-flex justify-content-center align-items-center gap-2 mb-2">
                  <strong className="fs-4">Descrizione</strong>
                  <img
                    src="/img/colors-icons/pencil.png"
                    alt="paper"
                    className="details-icon"
                  />
                </div>
                <p className="color-p">
                  {selectedColor.description ||
                    "Nessuna descrizione disponibile."}
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col md={6}>
            <Card
              className="info-card fade-down-cascade fade-delay-3"
              style={{
                border: `3px solid ${selectedColor.rgb}`,
                borderRadius: "15px",
              }}
            >
              <Card.Body>
                <div className="d-flex justify-content-center align-items-center gap-2 mb-2">
                  <strong className="fs-4">Un po' di storia</strong>
                  <img
                    src="/img/colors-icons/parchment.png"
                    alt="parchment"
                    className="details-icon"
                  />
                </div>
                <p className="color-p">{selectedColor.details || "—"}</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <CustomFooter />
    </div>
  );
}
