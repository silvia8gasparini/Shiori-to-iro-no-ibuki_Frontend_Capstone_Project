import { Container } from "react-bootstrap";
import { Facebook, Instagram, TwitterX, Youtube } from "react-bootstrap-icons";

const MyFooter = () => (
  <footer
    className="text-dark py-3 mt-5"
    style={{ background: "rgb(242, 242,242)" }}
  >
    <Container className="text-center mt-4">
      <Facebook className="mb-3 me-2" color="dark" />
      <Instagram className="mb-3 me-2" color="#dark" />
      <TwitterX className="mb-3 me-2" color="#dark" />
      <Youtube className="mb-3 me-2" color="#dark" />
      <p>
        &copy; {new Date().getFullYear()} Shiori to iro no ibuki. All rights
        reserved.
      </p>
    </Container>
  </footer>
);

export default MyFooter;
