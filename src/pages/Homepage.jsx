// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import CustomNavbar from "../components/CustomNavbar";
import CustomFooter from "../components/CustomFooter";
import Welcome from "../components/Welcome";

export default function Homepage() {
  /*  const [cardsPerSlide, setCardsPerSlide] = useState(6);
  const navigate = useNavigate();
/* 
  useEffect(() => {
    const updateCardsPerSlide = () => {
      const width = window.innerWidth;
      if (width < 576) setCardsPerSlide(1);
      else if (width < 768) setCardsPerSlide(2);
      else setCardsPerSlide(6);
    };
    updateCardsPerSlide();
    window.addEventListener("resize", updateCardsPerSlide);
    return () => window.removeEventListener("resize", updateCardsPerSlide);
  }, []); */

  return (
    <div className="d-flex flex-column" style={{ minHeight: "100vh" }}>
      <CustomNavbar />
      <Container fluid className="flex-grow-1 px-4">
        <Welcome />
        <h4 className="text-center my-3">
          Select a city to see the weather forecast!
        </h4>
      </Container>
      <CustomFooter />
    </div>
  );
}
