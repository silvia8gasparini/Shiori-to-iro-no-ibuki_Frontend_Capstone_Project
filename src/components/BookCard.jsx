import React from "react";
import { Card, Button } from "react-bootstrap";
import "../assets/bookSection.css";

const BookCard = ({ book, onBuyClick, onDetailsClick }) => {
  console.log("Rendering book:", book.title);
  return (
    <Card className="book-card h-100 shadow-sm mt-2">
      <Card.Img variant="top" src={book.imageUrl} alt={book.title} />
      <Card.Body className="d-flex flex-column justify-content-center">
        <Card.Title>{book.title}</Card.Title>
        <Card.Text className="text-muted mb-1">{book.author}</Card.Text>
        <p className="book-price mt-2">{book.price.toFixed(2)} €</p>

        <div className="d-flex justify-content-center mt-3 gap-4">
          <Button
            className="b-buy-btn"
            variant="outline-success"
            size="sm"
            onClick={() => onBuyClick(book.id)}
          >
            Acquista
          </Button>
          <Button
            className="b-details-btn"
            variant="outline-dark"
            size="sm"
            onClick={() => onDetailsClick(book.id)}
          >
            Dettagli
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default BookCard;
