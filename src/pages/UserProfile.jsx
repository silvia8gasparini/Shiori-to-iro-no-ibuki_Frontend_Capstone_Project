import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Container, Form, Button, Row, Col, Card } from "react-bootstrap";
import CustomNavbar from "../components/CustomNavbar";
import CustomFooter from "../components/CustomFooter";

function UserProfile() {
  const user = useSelector((state) => state.user.user);
  const token = localStorage.getItem("jwtToken");

  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    avatarUrl: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        surname: user.surname || "",
        email: user.email || "",
        avatarUrl: user.avatarUrl || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:8080/user/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Errore durante l'aggiornamento del profilo.");
      }

      alert("Profilo aggiornato con successo!");
    } catch (error) {
      console.error("Errore:", error);
      alert("Errore durante l'aggiornamento del profilo.");
    }
  };

  return (
    <div className="d-flex flex-column" style={{ minHeight: "100vh" }}>
      <CustomNavbar />
      <Container md={4} lg={6} className="my-5">
        <div className="d-flex justify-content-center gap-3">
          <h3 className="text-center mb-4 fs-2">Modifica profilo</h3>
          <img
            src="/img/user-icons/modified.png"
            alt="login"
            style={{ height: "38px" }}
          />
        </div>
        <Row className="justify-content-center">
          <Col md={4}>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formName" className="mb-3">
                <Form.Label>Nome</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group controlId="formSurname" className="mb-3">
                <Form.Label>Cognome</Form.Label>
                <Form.Control
                  type="text"
                  name="surname"
                  value={formData.surname}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group controlId="formEmail" className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Button variant="success" type="submit">
                Salva modifiche
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
      <CustomFooter />
    </div>
  );
}

export default UserProfile;
