import { useState } from "react";
import { Container } from "react-bootstrap";
import CustomNavbar from "../components/CustomNavbar";
import CustomFooter from "../components/CustomFooter";
import BookAdminPanel from "../components/BookAdminPanel";
import ReservationAdminPanel from "../components/ReservationAdminPanel";
import "../assets/backoffice.css";
import UserAdminPanel from "../components/PurchaseAdminPanel";

export default function Backoffice() {
  const [activeSection, setActiveSection] = useState("books");

  return (
    <div className="d-flex flex-column" style={{ minHeight: "100vh" }}>
      <CustomNavbar />

      <Container fluid className="container-bo flex-grow-1 px-4 py-5">
        <h2 className="mb-4">Pannello di Controllo Admin</h2>

        <div className="mb-4 d-flex gap-2 flex-wrap">
          <button
            className={`btn ${
              activeSection === "books" ? "btn-dark" : "btn-outline-dark"
            }`}
            onClick={() => setActiveSection("books")}
          >
            Gestione Libri
          </button>
          <button
            className={`btn ${
              activeSection === "reservations" ? "btn-dark" : "btn-outline-dark"
            }`}
            onClick={() => setActiveSection("reservations")}
          >
            Gestione Prenotazioni
          </button>
          <button
            className={`btn ${
              activeSection === "users" ? "btn-dark" : "btn-outline-dark"
            }`}
            onClick={() => setActiveSection("users")}
          >
            Gestione Utenti
          </button>
        </div>

        {/* Area contenuto */}
        <div className="section-wrapper">
          {activeSection === "books" && <BookAdminPanel />}
          {activeSection === "reservations" && <ReservationAdminPanel />}
          {activeSection === "users" && <UserAdminPanel />}
        </div>
      </Container>

      <CustomFooter />
    </div>
  );
}
