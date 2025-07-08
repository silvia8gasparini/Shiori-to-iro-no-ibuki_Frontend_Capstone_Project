import { Container, Row, Col, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";

const CustomNavbar = () => {
  return (
    <Navbar expand="md" className="custom-navbar">
      <Container>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <p className="title1 mb-0 d-md-none">
          Il respiro dei colori tra le pagine
        </p>
        <Navbar.Collapse id="responsive-navbar-nav">
          <Row className="w-100 align-items-center text-center">
            <Col
              xs={12}
              md={4}
              className="d-flex flex-column flex-md-row justify-content-center gap-0 gap-md-3 gap-lg-4 flex-wrap"
            >
              <Nav.Link
                as={Link}
                to="/"
                className="d-flex align-items-center gap-2"
              >
                <img
                  src="/img/navbar-icons/home.png"
                  alt="Home"
                  className="responsive-icon"
                />
                Home
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/"
                className="d-flex align-items-center gap-2"
              >
                <img
                  src="/img/navbar-icons/tea.png"
                  alt="tea"
                  className="responsive-icon"
                />
                Tea-room
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/"
                className="d-flex align-items-center gap-2"
              >
                <img
                  src="/img/navbar-icons/quillpen.png"
                  alt="quillpen"
                  className="responsive-icon"
                />
                Registrati
              </Nav.Link>
            </Col>
            <Col
              xs={12}
              md={4}
              className="d-none d-md-flex justify-content-center my-md-0"
            >
              <Navbar.Brand as={Link} to="/">
                <img src="/img/OfficialLogo1.png" alt="logo" className="logo" />
                <p className="title">Il respiro dei colori tra le pagine</p>
              </Navbar.Brand>
            </Col>
            <Col
              xs={12}
              md={4}
              className="d-flex flex-column flex-md-row justify-content-center gap-0 gap-md-3 gap-lg-4 flex-wrap"
            >
              <Nav.Link
                as={Link}
                to="/"
                className="d-flex align-items-center gap-2"
              >
                <img
                  src="/img/navbar-icons/key.png"
                  alt="key"
                  className="responsive-icon"
                />
                Login
              </Nav.Link>
              <NavDropdown
                title={
                  <span className="d-flex align-items-center gap-2">
                    <img
                      src="/img/navbar-icons/shoppingcart.png"
                      alt="cart"
                      className="responsive-icon"
                    />
                    Carrello
                  </span>
                }
                id="account-dropdown"
                className="d-flex align-items-center"
              ></NavDropdown>
            </Col>
          </Row>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
