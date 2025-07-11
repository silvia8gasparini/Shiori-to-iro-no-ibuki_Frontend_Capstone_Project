import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Row, Col, Card } from "react-bootstrap";
import CustomNavbar from "../components/CustomNavbar";
import CustomFooter from "../components/CustomFooter";

export default function SignUp() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    avatarUrl: "",
  });

  const [imageFile, setImageFile] = useState(null); // serve questo!

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  const uploadImageToCloudinary = async (file) => {
    const form = new FormData();
    form.append("file", file);
    form.append("upload_preset", "sg_default");

    const response = await fetch(
      "https://api.cloudinary.com/v1_1/dqyys0epr/image/upload",
      {
        method: "POST",
        body: form,
      }
    );

    const data = await response.json();
    return data.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let avatarUrl = "";

      if (imageFile) {
        avatarUrl = await uploadImageToCloudinary(imageFile);
      }

      const userData = {
        ...formData,
        avatarUrl, // aggiunge solo se presente
      };

      const response = await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        alert("Registrazione completata! Ora puoi fare il login.");
        navigate("/login");
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
          <Col md={6}>
            <Card className="shadow">
              <Card.Body>
                <div className="d-flex justify-content-center gap-3">
                  <h3 className="mb-4 text-center">Registrazione</h3>
                  <img
                    src="/img/user-icons/writing.png"
                    alt="writing"
                    style={{ height: "36px" }}
                  />
                </div>
                <Form onSubmit={handleSubmit} className="fs-5">
                  <Form.Group className="mb-3">
                    <Form.Label>Nome</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
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
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Carica avatar (opzionale)</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </Form.Group>

                  {imageFile && (
                    <div className="text-center mb-3">
                      <img
                        src={URL.createObjectURL(imageFile)}
                        alt="Anteprima avatar"
                        className="rounded-circle"
                        width={100}
                      />
                    </div>
                  )}

                  <div className="d-grid">
                    <Button variant="outline-dark" type="submit">
                      Registrati
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
