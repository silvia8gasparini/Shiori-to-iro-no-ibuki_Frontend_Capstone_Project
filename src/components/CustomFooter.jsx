import React from "react";
import { Container } from "react-bootstrap";
import { Facebook, Instagram, TwitterX, Youtube } from "react-bootstrap-icons";

const CustomFooter = () => (
  <footer className="custom-footer text-dark py-3 mt-5">
    <Container className="text-center mt-4">
      <Facebook className="mb-3 me-2" color="dark" />
      <Instagram className="mb-3 me-2" color="#dark" />
      <TwitterX className="mb-3 me-2" color="#dark" />
      <Youtube className="mb-3 me-2" color="#dark" />
      <p>
        &copy; {new Date().getFullYear()} <strong>しおりと色の息吹 </strong>- Il
        respiro dei colori tra le pagine. All rights reserved.
      </p>
    </Container>
  </footer>
);

export default CustomFooter;
