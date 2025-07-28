import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchBookById } from "../redux/booksSlice";
import { Container, Row, Col, Button, Alert } from "react-bootstrap";
import { Heart, HeartFill } from "react-bootstrap-icons";
import CustomNavbar from "../components/CustomNavbar";
import CustomFooter from "../components/CustomFooter";
import { addToCart } from "../redux/Cartslice";
import { fetchUserCart } from "../redux/cartActions";
import { addFavorite, addBorrow, fetchBorrows } from "../redux/userActions";
import "../assets/bookdetails.css";

export default function BookDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [showCartMessage, setShowCartMessage] = useState(false);
  const [showBorrowMessage, setShowBorrowMessage] = useState(false);
  const [addedToFavorites, setAddedToFavorites] = useState(false);
  const [justBorrowed, setJustBorrowed] = useState(false);

  const bookDetails = useSelector((state) => state.books.bookDetails);
  const favorites = useSelector((state) => state.user.favorites);
  const borrows = useSelector((state) => state.user.borrows);
  const userData = JSON.parse(localStorage.getItem("userData"));

  const { data: book, loading, error } = bookDetails;

  useEffect(() => {
    dispatch(fetchBookById(id));
    dispatch(fetchBorrows());
  }, [dispatch, id]);

  const isFavorite =
    (book && favorites.some((fav) => fav.bookId === book.id)) ||
    addedToFavorites;

  const isCurrentlyBorrowed =
    justBorrowed ||
    (book &&
      Array.isArray(borrows) &&
      borrows.some((b) => b.book?.id === book.id && !b.returned));

  const handleFavoriteClick = () => {
    if (!book || isFavorite) return;

    dispatch(addFavorite(book));
    setAddedToFavorites(true);
  };

  const handleBuyClick = () => {
    if (!book) return;

    const token = localStorage.getItem("jwtToken");

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
          setShowCartMessage(true);
          setTimeout(() => setShowCartMessage(false), 2000);
        })
        .catch((err) => {
          console.error("Errore:", err);
        });
    } else {
      dispatch(addToCart(book));
      setShowCartMessage(true);
      setTimeout(() => setShowCartMessage(false), 2000);
    }
  };

  const handleBorrowClick = () => {
    if (!userData || !userData.digitalCard?.id || !book) return;

    const today = new Date();
    const dueDate = new Date(today);
    dueDate.setDate(today.getDate() + 14);

    const borrowData = {
      startDate: today.toISOString().split("T")[0],
      dueDate: dueDate.toISOString().split("T")[0],
      bookId: book.id,
      digitalCardId: userData.digitalCard.id,
    };

    dispatch(addBorrow(borrowData)).then(() => {
      setJustBorrowed(true);
      dispatch(fetchBorrows());
      setShowBorrowMessage(true);
      setTimeout(() => setShowBorrowMessage(false), 2000);
    });
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
              <strong>Descrizione: </strong> {book.description}
            </p>

            <div className="fade-down-cascade fade-delay-8 mt-5 text-center">
              {showCartMessage && (
                <Alert
                  variant="success"
                  className="py-2 px-2 mb-3 mx-auto"
                  style={{ maxWidth: "250px" }}
                >
                  <div className="d-flex align-items-center justify-content-center gap-2">
                    Aggiunto al carrello!
                    <img
                      src="/img/books-icons/add-to-cart.png"
                      alt="check"
                      height="20"
                      style={{ width: "20px" }}
                    />
                  </div>
                </Alert>
              )}

              {showBorrowMessage && (
                <Alert
                  variant="info"
                  className="py-2 px-2 mb-3 mx-auto"
                  style={{ maxWidth: "280px" }}
                >
                  <div className="d-flex align-items-center justify-content-center gap-2">
                    Libro preso in prestito!
                    <img
                      src="/img/books-icons/borrow.png"
                      alt="borrow"
                      height="20"
                      style={{ width: "20px" }}
                    />
                  </div>
                </Alert>
              )}

              <div className="d-flex gap-4 justify-content-center flex-wrap">
                <Button
                  className="details-button"
                  variant="success"
                  onClick={handleBuyClick}
                >
                  Acquista
                </Button>

                {userData && (
                  <Button
                    className="details-button"
                    variant={isCurrentlyBorrowed ? "secondary" : "outline-dark"}
                    onClick={handleBorrowClick}
                    disabled={isCurrentlyBorrowed}
                  >
                    {isCurrentlyBorrowed ? "In prestito" : "Prendi in prestito"}
                  </Button>
                )}

                <Button
                  key={isFavorite ? "fav-yes" : "fav-no"}
                  variant={isFavorite ? "success" : "outline-danger"}
                  onClick={handleFavoriteClick}
                  disabled={isFavorite}
                >
                  {isFavorite ? (
                    <>
                      <HeartFill className="me-1" /> Aggiunto ai preferiti
                    </>
                  ) : (
                    <>
                      <Heart className="me-1" /> Aggiungi ai preferiti
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
      <CustomFooter />
    </div>
  );
}
