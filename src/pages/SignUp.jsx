import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import CustomNavbar from "../components/CustomNavbar";
import CustomFooter from "../components/CustomFooter";
import "../assets/user.css";

export default function SignUp() {
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userData = {
        ...formData,
      };

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData),
        }
      );

      if (response.ok) {
        setShowToast(true);
        setTimeout(() => navigate("/login"), 2500);
      } else {
        const error = await response.text();
        alert("Errore: " + error);
      }
    } catch (err) {
      alert("Errore durante la registrazione: " + err.message);
    }
  };

  return (
    <div className="d-flex flex-column" style={{ minHeight: "100vh" }}>
      <CustomNavbar />
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col md={5}>
            <Card className="shadow">
              <Card.Body>
                <div className="d-flex justify-content-center gap-3">
                  <h3 className="mb-4 text-center fs-2">Registrazione</h3>
                  <img
                    src="/img/user-icons/writing.png"
                    alt="writing"
                    style={{ height: "36px" }}
                  />
                </div>
                <Form onSubmit={handleSubmit} className="custom-form">
                  <Form.Group className="mb-3">
                    <Form.Label>Nome</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      placeholder="Inserisci il tuo nome"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Cognome</Form.Label>
                    <Form.Control
                      type="text"
                      name="surname"
                      placeholder="Inserisci il tuo cognome"
                      value={formData.surname}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="Inserisci la tua email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      placeholder="Inserisci la tua password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <div className="d-grid">
                    <Button
                      className="custom-button fs-5"
                      variant="outline-dark"
                      type="submit"
                    >
                      Registrati
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
              Yatta! Ora puoi effettuare il login!
            </div>
          </Toast.Header>
          <Toast.Body>
            <img
              src="/img/neko-thor3.png"
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
