import { useEffect, useState } from "react";
import { Table, Button, Spinner } from "react-bootstrap";

export default function ReservationAdminPanel() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    const token = localStorage.getItem("jwtToken");

    try {
      const response = await fetch(
        "http://localhost:8080/reservations?page=0&size=1000",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok)
        throw new Error("Errore nel caricamento delle prenotazioni");

      const data = await response.json();
      setReservations(data.content || []);
    } catch (err) {
      console.error("Errore nel fetch prenotazioni:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("jwtToken");
    if (!window.confirm("Vuoi eliminare questa prenotazione?")) return;

    try {
      const res = await fetch(`http://localhost:8080/reservations/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Errore eliminazione prenotazione");
      setReservations((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error("Errore eliminazione prenotazione:", err);
    }
  };

  if (loading) return <Spinner animation="border" variant="secondary" />;

  return (
    <div>
      <h4 className="mb-3">Prenotazioni Tea-Room</h4>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Utente</th>
            <th>Zona</th>
            <th>Data</th>
            <th>Fascia</th>
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((res) => (
            <tr key={res.id}>
              <td>{res.user?.name || "-"}</td>
              <td>{res.tearoomZone?.name || "-"}</td>
              <td>{res.date}</td>
              <td>{res.timeSlot}</td>
              <td>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(res.id)}
                >
                  Elimina
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
