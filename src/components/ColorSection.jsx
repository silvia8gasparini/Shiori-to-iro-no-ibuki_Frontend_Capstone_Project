import { useSelector } from "react-redux";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../assets/colorSection.css";

function isDark(rgbString) {
  const rgb = rgbString
    .replace(/[^\d,]/g, "")
    .split(",")
    .map(Number);
  const brightness = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
  return brightness < 128;
}

const ColorSection = () => {
  const navigate = useNavigate();
  const { selectedColor, loading, error } = useSelector(
    (state) => state.selectedColor
  );

  if (loading) return <p>Caricamento colore...</p>;
  if (error) return <p>Errore: {error}</p>;
  if (!selectedColor) return null;

  const textColor = isDark(selectedColor.rgb) ? "white" : "black";

  return (
    <>
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
            <Button
              style={{
                color: textColor,
                borderColor: textColor,
                backgroundColor: "transparent",
              }}
              type="submit"
              className={`color-button mt-2 ${
                textColor === "white" ? "light-hover" : "dark-hover"
              }`}
              onClick={() => navigate("/color-details")}
            >
              Dettagli
            </Button>
          </Col>
        </Row>
      </Container>

      {selectedColor.theme && (
        <Container className="theme-section mt-5">
          <p className="theme-text text-center">{selectedColor.theme}</p>
        </Container>
      )}
    </>
  );
};

export default ColorSection;
