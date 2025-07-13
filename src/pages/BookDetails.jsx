import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchBookById } from "../redux/booksSlice";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Heart, HeartFill } from "react-bootstrap-icons";
import CustomNavbar from "../components/CustomNavbar";
import CustomFooter from "../components/CustomFooter";
import { addToCart } from "../redux/Cartslice";
import { fetchUserCart } from "../redux/cartActions";
import { addFavorite, removeFavorite } from "../redux/userActions";
import "../assets/bookdetails.css";

export default function BookDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const {
    data: book,
    loading,
    error,
  } = useSelector((state) => state.books.bookDetails);
  const favorites = useSelector((state) => state.user.favorites);

  useEffect(() => {
    dispatch(fetchBookById(id));
  }, [dispatch, id]);

  const isFavorite = book ? favorites.some((fav) => fav.id === book.id) : false;

  const handleFavoriteClick = () => {
    if (!book) return;
    if (isFavorite) {
      dispatch(removeFavorite(book.id));
    } else {
      dispatch(addFavorite(book));
    }
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
                onClick={async () => {
                  const user = JSON.parse(localStorage.getItem("userData"));
                  const token = localStorage.getItem("jwtToken");

                  if (user && token) {
                    try {
                      const res = await fetch(
                        `http://localhost:8080/cart-items/book/${book.id}`,
                        {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                          },
                          body: JSON.stringify({
                            quantity: 1,
                            priceAtSelection: book.price,
                          }),
                        }
                      );

                      if (!res.ok)
                        throw new Error("Errore nell'aggiunta al carrello");

                      dispatch(fetchUserCart());
                    } catch (err) {
                      console.error("Errore:", err);
                    }
                  } else {
                    dispatch(addToCart(book));
                  }
                }}
              >
                Acquista
              </Button>

              <Button
                key={isFavorite ? "fav-yes" : "fav-no"}
                variant={isFavorite ? "danger" : "outline-danger"}
                onClick={handleFavoriteClick}
              >
                {isFavorite ? <HeartFill /> : <Heart />}{" "}
                {isFavorite ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
      <CustomFooter />
    </div>
  );
}
