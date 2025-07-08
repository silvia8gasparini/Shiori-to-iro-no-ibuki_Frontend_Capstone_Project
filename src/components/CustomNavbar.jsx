import { Container, Row, Col, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";

const CustomNavbar = () => {
  return (
    <Navbar className="custom-navbar">
      <Container>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Row className="w-100 align-items-center text-center">
            <Col
              xs={12}
              md={4}
              className="d-flex justify-content-center gap-5 flex-wrap"
            >
              <Nav.Link as={Link} to="/">
                Home
              </Nav.Link>
              <Nav.Link as={Link} to="/">
                Tea-room
              </Nav.Link>
              <Nav.Link as={Link} to="/">
                Registrati
              </Nav.Link>
            </Col>
            <Col
              xs={12}
              md={4}
              className="d-flex justify-content-center my-md-0"
            >
              <Navbar.Brand as={Link} to="/">
                <img src="/img/OfficialLogo1.png" alt="logo" className="logo" />
                <p className="title">Il respiro dei colori tra le pagine</p>
              </Navbar.Brand>
            </Col>
            <Col
              xs={12}
              md={4}
              className="d-flex justify-content-center gap-5 flex-wrap"
            >
              <NavDropdown title="Login" id="account-dropdown"></NavDropdown>
              <NavDropdown title="Carrello" id="cart-dropdown" />
            </Col>
          </Row>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
