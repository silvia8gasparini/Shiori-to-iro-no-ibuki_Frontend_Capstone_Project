import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Row, Col, Spinner, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import BookCard from "./BookCard";
import { fetchBooksByMicroSeasonId } from "../redux/booksSlice";
import "../assets/bookSection.css";

const BookSection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { booksForSeason, loading, error } = useSelector(
    (state) => state.books
  );

  const microSeasonId = useSelector(
    (state) => state.selectedColor.selectedColor?.microSeason?.id
  );

  useEffect(() => {
    if (microSeasonId) {
      dispatch(fetchBooksByMicroSeasonId(microSeasonId));
    }
  }, [dispatch, microSeasonId]);

  const handleBuy = (bookId) => navigate(`/purchase/${bookId}`);
  const handleDetails = (bookId) => navigate(`/books/${bookId}`);

  if (loading) return <Spinner animation="border" variant="secondary" />;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!booksForSeason || booksForSeason.length === 0)
    return <p>Nessun libro disponibile.</p>;

  return (
    <Container fluid className="mt-4">
      <Row className="g-4 justify-content-center mx-5">
        {booksForSeason.map((book) => (
          <Col key={book.id} xs={12} sm={6} md={4} lg={3} xl={3}>
            <BookCard
              book={book}
              onBuyClick={handleBuy}
              onDetailsClick={handleDetails}
            />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default BookSection;
