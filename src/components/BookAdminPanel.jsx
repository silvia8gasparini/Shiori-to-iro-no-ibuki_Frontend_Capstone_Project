import { useEffect, useState } from "react";
import { Table, Button, Spinner, Form } from "react-bootstrap";

export default function BookAdminPanel() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBook, setEditingBook] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    const token = localStorage.getItem("jwtToken");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}books?page=0&size=1000`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Errore nel caricamento dei libri");

      const data = await response.json();
      setBooks(data.content || data);
    } catch (err) {
      console.error("Errore nel fetch dei libri:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (book) => {
    const token = localStorage.getItem("jwtToken");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}books/${book.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Errore fetch dettagli libro");

      const fullBook = await response.json();
      setEditingBook(fullBook);
    } catch (err) {
      console.error("Errore nel fetch dettagliato:", err);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingBook((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const token = localStorage.getItem("jwtToken");
    const completeBook = {
      ...editingBook,
      microSeason: { id: editingBook.microSeason?.id },
      seasonalColor: { id: editingBook.seasonalColor?.id },
    };

    console.log("Oggetto completo da inviare:", completeBook);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}books/${editingBook.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(completeBook),
        }
      );

      const responseText = await response.text();
      console.log("Risposta raw del server:", responseText);
      console.log("Status:", response.status, response.statusText);

      if (!response.ok) throw new Error("Errore salvataggio modifica");

      setBooks((prevBooks) =>
        prevBooks.map((b) => (b.id === editingBook.id ? completeBook : b))
      );
      setEditingBook(null);
    } catch (err) {
      console.error("Errore aggiornamento libro:", err);
    }
  };

  const handleDelete = async (bookId) => {
    const token = localStorage.getItem("jwtToken");
    if (!window.confirm("Sei sicuro di voler eliminare questo libro?")) return;
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}books/${bookId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error("Errore nell'eliminazione");
      setBooks((prev) => prev.filter((b) => b.id !== bookId));
    } catch (err) {
      console.error("Errore eliminazione libro:", err);
    }
  };

  if (loading) return <Spinner animation="border" variant="primary" />;

  return (
    <div>
      <h4 className="mb-3">Libri disponibili</h4>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Titolo</th>
            <th>Autore</th>
            <th>Anno</th>
            <th>Casa editrice</th>
            <th>Prezzo</th>
            <th>Disponibilità</th>
            <th>Descrizione</th>
            <th>ImgUrl</th>
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) =>
            editingBook?.id === book.id ? (
              <tr key={book.id}>
                <td>
                  <Form.Control
                    name="title"
                    value={editingBook.title}
                    onChange={handleEditChange}
                  />
                </td>
                <td>
                  <Form.Control
                    name="author"
                    value={editingBook.author}
                    onChange={handleEditChange}
                  />
                </td>
                <td>
                  <Form.Control
                    name="year"
                    value={editingBook.year}
                    onChange={handleEditChange}
                  />
                </td>
                <td>
                  <Form.Control
                    name="publisher"
                    value={editingBook.publisher}
                    onChange={handleEditChange}
                  />
                </td>
                <td>
                  <Form.Control
                    name="price"
                    type="number"
                    value={editingBook.price}
                    onChange={handleEditChange}
                  />
                </td>
                <td>
                  <Form.Select
                    name="availability"
                    value={editingBook.availability}
                    onChange={handleEditChange}
                  >
                    <option value="AVAILABLE">Disponibile</option>
                    <option value="UNAVAILABLE">Non disponibile</option>
                  </Form.Select>
                </td>
                <td>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="description"
                    value={editingBook.description}
                    onChange={handleEditChange}
                  />
                </td>
                <td>
                  <Form.Control
                    name="imageUrl"
                    value={editingBook.imageUrl}
                    onChange={handleEditChange}
                  />
                </td>
                <td>
                  <Button variant="success" size="sm" onClick={handleSave}>
                    Salva
                  </Button>{" "}
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setEditingBook(null)}
                  >
                    Annulla
                  </Button>
                </td>
              </tr>
            ) : (
              <tr key={book.id}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.year}</td>
                <td>{book.publisher}</td>
                <td>€ {book.price.toFixed(2)}</td>
                <td>{book.availability}</td>
                <td>
                  {book.description?.length > 80
                    ? book.description.slice(0, 80) + "..."
                    : book.description}
                </td>
                <td>
                  <a
                    href={book.imageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {book.imageUrl?.slice(0, 30)}...
                  </a>
                </td>
                <td>
                  <Button
                    variant="outline-dark"
                    size="sm"
                    onClick={() => handleEdit(book)}
                  >
                    Modifica
                  </Button>{" "}
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDelete(book.id)}
                  >
                    Elimina
                  </Button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </Table>
    </div>
  );
}
