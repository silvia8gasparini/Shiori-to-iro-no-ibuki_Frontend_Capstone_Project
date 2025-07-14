import {
  Container,
  Row,
  Col,
  Nav,
  Navbar,
  NavDropdown,
  Form,
  Button,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { performLogout } from "../redux/userActions";
import { deleteCartItem } from "../redux/cartActions";
import { removeFromCart } from "../redux/Cartslice";
import "../assets/user.css";

const CustomNavbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showToast, setShowToast] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const user = useSelector((state) => state.user.user);
  const cartItemsFromRedux = useSelector((state) => state.cart.items);

  const isLoggedIn = Boolean(user);
  const guestCart = localStorage.getItem("cartItems");
  const guestCartItems = guestCart ? JSON.parse(guestCart) : [];

  const cartItems = isLoggedIn ? cartItemsFromRedux : guestCartItems;

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/details/${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const handleLogout = () => {
    dispatch(performLogout());
    setShowToast(true);
    setTimeout(() => {
      navigate("/");
    }, 2500);
  };

  return (
    <Navbar expand="md" className="custom-navbar">
      <Container>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <div className="d-flex align-items-center d-md-none mb-2 mobile-brand">
          <img
            src="/img/OfficialLogo1.png"
            alt="logo"
            className="logo-mobile me-2"
          />
          <p className="title1 mb-0">Il respiro dei colori tra le pagine</p>
        </div>
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
                to="/tea-room"
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
                to="/signup"
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
              className="d-flex flex-column flex-md-row justify-content-center gap-0 gap-md-0 gap-lg-4 flex-wrap"
            >
              <Form className="search-form d-flex mx-5" onSubmit={handleSearch}>
                <Form.Control
                  type="search"
                  placeholder="Search"
                  className="search-input me-2"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button
                  variant="outline-dark"
                  type="submit"
                  className="search-button"
                >
                  Search
                </Button>
              </Form>

              <NavDropdown
                title={
                  <span className="d-flex align-items-center gap-2 position-relative">
                    <div className="position-relative">
                      <img
                        src="/img/navbar-icons/shoppingcart.png"
                        alt="cart"
                        className="responsive-icon"
                      />
                      {totalItems > 0 && (
                        <span className="cart-badge badge rounded-pill bg-danger">
                          {totalItems}
                        </span>
                      )}
                    </div>
                    Carrello
                  </span>
                }
                className="custom-dropdown d-flex align-items-center"
              >
                {cartItems.length === 0 ? (
                  <NavDropdown.Item>Il tuo carrello è vuoto</NavDropdown.Item>
                ) : (
                  <>
                    {cartItems.map((item, index) => (
                      <NavDropdown.Item
                        key={index}
                        className="d-flex justify-content-between align-items-center text-wrap"
                      >
                        <div
                          className="me-2"
                          style={{ maxWidth: "180px", wordBreak: "break-word" }}
                        >
                          <span>
                            {item.title}
                            {item.author && ` - ${item.author}`}
                            {item.quantity > 1 && ` ×${item.quantity}`}
                          </span>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          <span>
                            {(item.price * item.quantity).toFixed(2)} €
                          </span>
                          <button
                            onClick={() => {
                              if (isLoggedIn) {
                                dispatch(deleteCartItem(item.id));
                              } else {
                                dispatch(removeFromCart(item.id));
                              }
                            }}
                            className="btn btn-sm p-0 border-0 bg-transparent d-flex align-items-center"
                            title="Rimuovi dal carrello"
                          >
                            <img
                              src="/img/navbar-icons/bin.png"
                              alt="Rimuovi"
                              width="16"
                              height="16"
                              style={{ filter: "grayscale(50%)" }}
                            />
                          </button>
                        </div>
                      </NavDropdown.Item>
                    ))}
                    <NavDropdown.Divider />
                    <div className="px-3 py-2">
                      <strong>Totale: {totalPrice.toFixed(2)} €</strong>
                      <Button
                        variant="outline-dark"
                        size="sm"
                        className="w-100 mt-2"
                        onClick={() =>
                          navigate(isLoggedIn ? "/checkout" : "/login")
                        }
                      >
                        {isLoggedIn ? "Paga" : "Accedi e paga"}
                      </Button>
                    </div>
                  </>
                )}
              </NavDropdown>

              {user ? (
                <NavDropdown
                  title={
                    <div className="d-flex align-items-center justify-content-center gap-2">
                      <span className="hello-user d-flex align-items-center gap-2">
                        Ciao, {user.name}!
                      </span>
                      <img
                        src="/public/img/navbar-icons/bamboo.png"
                        alt="bamboo"
                        height="35"
                        style={{ filter: "grayscale(50%)" }}
                      />
                    </div>
                  }
                  className="custom-dropdown-user"
                >
                  {user.role === "ADMIN" ? (
                    <NavDropdown.Item as={Link} to="/backoffice">
                      Back-office
                    </NavDropdown.Item>
                  ) : (
                    <NavDropdown.Item as={Link} to="/user/page">
                      Spazio Personale
                    </NavDropdown.Item>
                  )}

                  <NavDropdown.Item as={Link} to="/user/profile">
                    Modifica Profilo
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <Nav.Link
                  as={Link}
                  to="/login"
                  className="d-flex align-items-center gap-2 me-md-3"
                >
                  <img
                    src="/img/navbar-icons/key.png"
                    alt="key"
                    className="responsive-icon"
                  />
                  Accedi
                </Nav.Link>
              )}
            </Col>
          </Row>
        </Navbar.Collapse>
      </Container>
      <ToastContainer
        className="position-fixed top-50 start-50 translate-middle p-3"
        style={{ zIndex: 1055 }}
      >
        <Toast
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={2500}
          autohide
          bg="white"
          className="text-center"
        >
          <Toast.Header closeButton={false}>
            <div className="text-center fw-bold mx-2 fs-3">Sayōnara!</div>
          </Toast.Header>
          <Toast.Body>
            <img
              src="/public/img/neko-thor1.png"
              alt="neko-thor"
              style={{ width: "320px" }}
            />
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </Navbar>
  );
};

export default CustomNavbar;
