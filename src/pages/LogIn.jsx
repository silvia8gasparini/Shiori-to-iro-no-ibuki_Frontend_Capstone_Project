import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  Container,
  Form,
  Button,
  Row,
  Col,
  Card,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import { loginSuccess, setCartItems } from "../redux/Userslice";
import { syncCartToBackend } from "../redux/cartActions";
import CustomNavbar from "../components/CustomNavbar";
import CustomFooter from "../components/CustomFooter";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showToast, setShowToast] = useState(false);
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setCredentials((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
        }
      );

      if (response.ok) {
        const token = await response.text();
        localStorage.setItem("jwtToken", token);

        const userResponse = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/user/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (userResponse.ok) {
          const userData = await userResponse.json();
          localStorage.setItem("userData", JSON.stringify(userData));
          dispatch(loginSuccess(userData));

          const storedCart = localStorage.getItem("cartItems");
          if (storedCart) {
            dispatch(setCartItems(JSON.parse(storedCart)));
          }

          dispatch(syncCartToBackend());

          setShowToast(true);
          setTimeout(() => navigate("/"), 2500);
        } else {
          alert("Errore nel recupero del profilo utente.");
        }
      } else {
        const error = await response.text();
        alert("Errore: " + error);
      }
    } catch (err) {
      alert("Errore di connessione: " + err.message);
    }
  };

  return (
    <div className="d-flex flex-column" style={{ minHeight: "100vh" }}>
      <CustomNavbar />
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col md={4}>
            <Card className="shadow">
              <Card.Body>
                <div className="d-flex justify-content-center gap-2">
                  <h3 className="text-center mb-4 fs-2">Login</h3>
                  <img
                    src="/img/user-icons/login.png"
                    alt="login"
                    style={{ height: "38px" }}
                  />
                </div>
                <Form onSubmit={handleLogin} className="login-form fs-5">
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="Inserisci la tua email"
                      value={credentials.email}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      placeholder="Inserisci la password"
                      value={credentials.password}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <div className="d-grid">
                    <Button
                      className="fs-4"
                      type="submit"
                      variant="outline-dark"
                    >
                      Accedi
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
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
            <div className="text-dark text-center fw-bold mx-2 fs-4">
              Konnichiwa!
            </div>
          </Toast.Header>
          <Toast.Body>
            <img
              src="/public/img/neko-thor.png"
              alt="fat-cat"
              style={{ width: "320px" }}
            />
          </Toast.Body>
        </Toast>
      </ToastContainer>

      <CustomFooter />
    </div>
  );
}
