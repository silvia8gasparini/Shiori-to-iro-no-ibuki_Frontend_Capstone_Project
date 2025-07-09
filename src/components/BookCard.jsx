import React from "react";
import { Card, Button } from "react-bootstrap";
import "../assets/bookSection.css";

const BookCard = ({ book, onBuyClick, onDetailsClick }) => {
  console.log("🧱 Rendering book:", book.title);
  return (
    <Card className="h-100 shadow-sm">
      <Card.Img
        variant="top"
        src={book.imageUrl}
        alt={book.title}
        style={{
          objectFit: "contain",
          width: "100%",
          height: "300px",
        }}
      />
      <Card.Body className="d-flex flex-column justify-content-center">
        <Card.Title className="fs-5">{book.title}</Card.Title>
        <div className="d-flex justify-content-center mt-3 gap-5">
          <Button
            variant="outline-success"
            size="sm"
            onClick={() => onBuyClick(book.id)}
          >
            Acquista
          </Button>
          <Button
            variant="outline-primary"
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
