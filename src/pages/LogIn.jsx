import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/userSlice";
import { Container, Form, Button, Row, Col, Card } from "react-bootstrap";
import CustomNavbar from "../components/CustomNavbar";
import CustomFooter from "../components/CustomFooter";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
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
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        const token = await response.text();
        localStorage.setItem("jwtToken", token);

        const userResponse = await fetch("http://localhost:8080/user/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          localStorage.setItem("userData", JSON.stringify(userData));
          dispatch(loginSuccess(userData));
          alert("Login effettuato con successo!");
          navigate("/");
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
          <Col md={6}>
            <Card className="shadow">
              <Card.Body>
                <h3 className="text-center mb-4">Login</h3>
                <Form onSubmit={handleLogin} className="fs-5">
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
                    <Button type="submit" variant="outline-dark">
                      Accedi
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <CustomFooter />
    </div>
  );
}
