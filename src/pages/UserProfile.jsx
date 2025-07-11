import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Container, Form, Button } from "react-bootstrap";
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
      <Container className="my-5">
        <h2 className="mb-4">Modifica Profilo</h2>
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

          <Form.Group controlId="formAvatarUrl" className="mb-3">
            <Form.Label>Avatar URL</Form.Label>
            <Form.Control
              type="text"
              name="avatarUrl"
              value={formData.avatarUrl}
              onChange={handleChange}
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Salva modifiche
          </Button>
        </Form>
      </Container>
      <CustomFooter />
    </div>
  );
}

export default UserProfile;
