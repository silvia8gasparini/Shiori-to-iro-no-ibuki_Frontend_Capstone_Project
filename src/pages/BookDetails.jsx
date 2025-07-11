import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchBookById } from "../redux/booksSlice";
import { toggleFavorite } from "../redux/favoritesSlice";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Heart, HeartFill } from "react-bootstrap-icons";
import CustomNavbar from "../components/CustomNavbar";
import CustomFooter from "../components/CustomFooter";
import "../assets/bookdetails.css";

export default function BookDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const {
    data: book,
    loading,
    error,
  } = useSelector((state) => state.books.bookDetails);
  const favorites = useSelector((state) => state.favorites.items);
  const isFavorite = book && favorites.includes(book.id);

  useEffect(() => {
    dispatch(fetchBookById(id));
  }, [dispatch, id]);

  const handleBuy = () => {
    console.log("Acquisto libro:", book.title);
  };

  const handleFavoriteClick = () => {
    dispatch(toggleFavorite(book.id));
  };

  if (loading) return <p>Caricamento in corso…</p>;
  if (error) return <p>Errore: {error}</p>;
  if (!book) return null;

  return (
    <div className="d-flex flex-column" style={{ minHeight: "100vh" }}>
      <CustomNavbar />
      <Container className="book-details my-5">
        <div className="d-flex justify-content-center gap-3">
          <h3 className="details-title mb-5 text-center">Dettagli libro</h3>
          <img
            src="/img/books-icons/open-book.png"
            alt="open-book"
            className="book-icon"
          />
        </div>
        <Row className="align-items-center">
          <Col md={5} className="text-start mb-4">
            <img
              src={book.imageUrl}
              alt={book.title}
              className="img-fluid book-details-image fade-in"
            />
          </Col>
          <Col md={7}>
            <p className="fade-down-cascade fade-delay-1">
              <strong>Titolo: </strong> {book.title}
            </p>
            <p className="fade-down-cascade fade-delay-2">
              <strong>Autore: </strong> {book.author}
            </p>
            <p className="fade-down-cascade fade-delay-3">
              <strong>Anno: </strong> {book.year}
            </p>
            <p className="fade-down-cascade fade-delay-4">
              <strong>Editore: </strong> {book.publisher}
            </p>
            <p className="fade-down-cascade fade-delay-5">
              <strong>ISBN: </strong> {book.isbn}
            </p>
            <p className="fade-down-cascade fade-delay-6">
              <strong>Prezzo: </strong> {book.price.toFixed(2)} €
            </p>
            <p className="mt-4 fade-down-cascade fade-delay-7">
              {" "}
              <strong>Descrizione: </strong>
              {book.description}
            </p>

            <div className="d-flex gap-4 mt-5 justify-content-center fade-down-cascade fade-delay-8">
              <Button
                className="details-button"
                variant="success"
                onClick={handleBuy}
              >
                Acquista
              </Button>
              <Button
                className="favorites-button"
                variant={isFavorite ? "danger" : "outline-dark"}
                onClick={handleFavoriteClick}
              >
                {isFavorite ? <HeartFill /> : <Heart />} Preferiti
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
      <CustomFooter />
    </div>
  );
}
