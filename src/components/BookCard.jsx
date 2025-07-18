import React, { useState } from "react";
import { Card, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/Cartslice";
import { fetchUserCart } from "../redux/cartActions";
import "../assets/bookSection.css";

const BookCard = ({ book }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showMessage, setShowMessage] = useState(false);

  const handleBuyClick = () => {
    const token = localStorage.getItem("jwtToken");
    const userData = localStorage.getItem("userData");

    if (token && userData) {
      fetch(`${import.meta.env.VITE_API_BASE_URL}/cart-items/book/${book.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bookId: book.id,
          quantity: 1,
          priceAtSelection: book.price,
        }),
      })
        .then((res) => {
          if (!res.ok) throw new Error("Errore nell'aggiunta al carrello");
          return res.json();
        })
        .then(() => {
          dispatch(fetchUserCart());
          setShowMessage(true);
          setTimeout(() => setShowMessage(false), 2000);
        })
        .catch((err) => {
          console.error("Errore:", err);
        });
    } else {
      dispatch(addToCart(book));
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 2000);
    }
  };

  return (
    <Card className="book-card h-100 shadow-sm mt-2">
      <Card.Img variant="top" src={book.imageUrl} alt={book.title} />
      <Card.Body className="d-flex flex-column justify-content-center">
        <Card.Title>{book.title}</Card.Title>
        <Card.Text className="text-muted mb-1">{book.author}</Card.Text>
        <p className="book-availability my-1 text-success">
          <span>{book.availability}</span>
        </p>
        <p className="book-price">{book.price.toFixed(2)} €</p>

        {showMessage && (
          <Alert variant="success" className="py-2 px-2 mt-2 text-center">
            <div className="d-flex align-items-center justify-content-center gap-2">
              Aggiunto al carrello!
              <img
                src="/img/books-icons/add-to-cart.png"
                alt="check"
                height="20"
                style={{ marginTop: "0px", width: "20px" }}
              />
            </div>
          </Alert>
        )}

        <div className="d-flex justify-content-center mt-2 gap-4">
          <Button className="buy-button" onClick={handleBuyClick}>
            Acquista
          </Button>
          <Button
            className="details-button"
            onClick={() => navigate(`/books/${book.id}`)}
          >
            Dettagli
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default BookCard;
