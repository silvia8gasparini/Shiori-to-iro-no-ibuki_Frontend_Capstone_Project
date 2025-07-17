import React from "react";
import { Container } from "react-bootstrap";
import CustomNavbar from "../components/CustomNavbar";
import CustomFooter from "../components/CustomFooter";
import Welcome from "../components/Welcome";
import ColorSection from "../components/ColorSection";
import BookSection from "../components/BookSection";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Homepage() {
  return (
    <div className="d-flex flex-column" style={{ minHeight: "100vh" }}>
      <CustomNavbar />
      <Container fluid className="flex-grow-1 px-4">
        <Welcome />
        <ColorSection />
        <BookSection />
      </Container>
      <CustomFooter />
    </div>
  );
}
