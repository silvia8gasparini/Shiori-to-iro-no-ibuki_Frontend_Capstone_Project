import { Container } from "react-bootstrap";
import CustomNavbar from "../components/CustomNavbar";
import CustomFooter from "../components/CustomFooter";
import ColorSection from "../components/ColorSection";
import BookSection from "../components/BookSection";
import "bootstrap/dist/css/bootstrap.min.css";

export default function BookDetails() {
  return (
    <div className="d-flex flex-column" style={{ minHeight: "100vh" }}>
      <CustomNavbar />
      <Container fluid className="flex-grow-1 px-4">
        <ColorSection />
        <BookSection />
      </Container>
      <CustomFooter />
    </div>
  );
}
