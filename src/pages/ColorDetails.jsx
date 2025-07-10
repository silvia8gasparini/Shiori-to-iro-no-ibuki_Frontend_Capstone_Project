import { useSelector } from "react-redux";
import { Container, Row, Col, Table } from "react-bootstrap";
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
          <p>Colore non disponibile.</p>
        </Container>
        <CustomFooter />
      </div>
    );
  }

  const textColor = isDark(selectedColor.rgb) ? "white" : "black";

  return (
    <div className="d-flex flex-column" style={{ minHeight: "100vh" }}>
      <CustomNavbar />

      <Container fluid className="color-section px-0 mt-4">
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

      <Container className="mt-5 mb-5 text-start px-5">
        <div className="d-flex justify-content-center gap-3">
          <h3 className="details-title mb-4 text-center">Dettagli colore</h3>
          <img
            src="/img/colors-icons/paint.png"
            alt="paint"
            className="paint-icon"
          />
        </div>

        <div className="color-rgb mb-4 fade-down-cascade fade-delay-1">
          <div className="d-flex gap-3 text-center">
            <strong>RGB</strong>
            <img
              src="/img/colors-icons/wheel.png"
              alt="wheel"
              className="details-icon"
            />
          </div>
          <p className="color-p">{selectedColor.rgb}</p>
        </div>

        <div className="description mb-4 fade-down-cascade fade-delay-2">
          <div className="d-flex gap-3">
            <strong>Descrizione</strong>
            <img
              src="/img/colors-icons/pencil.png"
              alt="paper"
              className="details-icon"
            />
          </div>

          <p className="color-p">
            {selectedColor.description || "Nessuna descrizione disponibile."}
          </p>
        </div>

        <div className="story mb-3 fade-down-cascade fade-delay-3">
          <div className="d-flex gap-3">
            <strong>Un po' di storia</strong>
            <img
              src="/img/colors-icons/parchment.png"
              alt="wheel"
              className="details-icon"
            />
          </div>
          <p className="color-p">{selectedColor.details || "—"}</p>
        </div>
      </Container>

      <CustomFooter />
    </div>
  );
}
