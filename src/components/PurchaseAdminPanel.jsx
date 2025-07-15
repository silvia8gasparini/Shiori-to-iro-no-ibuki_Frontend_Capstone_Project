import { useEffect, useState } from "react";
import { Table, Spinner, Button } from "react-bootstrap";

export default function PurchaseAdminPanel() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    const token = localStorage.getItem("jwtToken");

    try {
      const res = await fetch(
        "http://localhost:8080/purchase?page=0&size=1000",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Errore nel caricamento acquisti");

      const data = await res.json();
      setPurchases(data.content || data);
    } catch (err) {
      console.error("Errore nel fetch acquisti:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("jwtToken");
    if (!window.confirm("Vuoi eliminare questo acquisto?")) return;

    try {
      const res = await fetch(`http://localhost:8080/purchase/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Errore eliminazione acquisto");

      setPurchases((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Errore eliminazione acquisto:", err);
    }
  };

  if (loading) return <Spinner animation="border" variant="primary" />;

  return (
    <div>
      <h4 className="mb-3">Storico Acquisti</h4>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Utente</th>
            <th>Email</th>
            <th>Libro</th>
            <th>Data</th>
            <th>Totale</th>
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody>
          {purchases.map((p) => (
            <tr key={p.id}>
              <td>{p.user?.name || "-"}</td>
              <td>{p.user?.email || "-"}</td>
              <td>{p.book?.title || "-"}</td>
              <td>{p.purchaseDate?.split("T")[0]}</td>
              <td>€ {p.total?.toFixed(2)}</td>
              <td>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(p.id)}
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
