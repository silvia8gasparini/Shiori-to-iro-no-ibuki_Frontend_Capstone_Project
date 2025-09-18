import React from "react";
import { Container } from "react-bootstrap";

const CustomFooter = () => (
  <footer className="custom-footer text-dark py-3 mt-5">
    <Container className="text-center mt-4">
      <p>
        &copy; {new Date().getFullYear()} <strong>しおりと色の息吹 </strong>- Il
        respiro dei colori tra le pagine. All rights reserved.
      </p>
    </Container>
  </footer>
);

export default CustomFooter;
