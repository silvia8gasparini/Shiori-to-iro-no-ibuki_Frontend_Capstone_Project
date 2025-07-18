import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Container, Row, Col, Spinner, Pagination } from "react-bootstrap";
import BookCard from "../components/BookCard";
import CustomNavbar from "../components/CustomNavbar";
import CustomFooter from "../components/CustomFooter";

const SearchResults = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("q") || "";
  const baseUrl = import.meta.env.VITE_API_BASE_URL.replace(/\/+$/, "");

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 9;

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${baseUrl}/books/search?q=${encodeURIComponent(
            query
          )}&page=${currentPage}&size=${pageSize}`
        );
        const data = await response.json();
        setResults(data.content);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Errore nel caricamento dei risultati:", error);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchResults();
    }
  }, [query, currentPage]);

  const handlePageChange = (page) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="d-flex flex-column" style={{ minHeight: "100vh" }}>
      <CustomNavbar />
      <Container className="mt-5">
        <h2 className="results-title mb-4 text-center">
          Risultati per: “{query}”
        </h2>

        {loading ? (
          <div className="d-flex justify-content-center my-5">
            <Spinner animation="border" />
          </div>
        ) : results.length === 0 ? (
          <p className="text-center">Nessun risultato trovato.</p>
        ) : (
          <>
            <Row className="g-4">
              {results.map((book) => (
                <Col key={book.id} xs={12} sm={6} md={3}>
                  <BookCard book={book} />
                </Col>
              ))}
            </Row>

            {totalPages > 1 && (
              <div className="d-flex justify-content-center mt-4">
                <Pagination>
                  <Pagination.Prev
                    disabled={currentPage === 0}
                    onClick={() => handlePageChange(currentPage - 1)}
                  />
                  {[...Array(totalPages)].map((_, index) => (
                    <Pagination.Item
                      key={index}
                      active={index === currentPage}
                      onClick={() => handlePageChange(index)}
                    >
                      {index + 1}
                    </Pagination.Item>
                  ))}
                  <Pagination.Next
                    disabled={currentPage === totalPages - 1}
                    onClick={() => handlePageChange(currentPage + 1)}
                  />
                </Pagination>
              </div>
            )}
          </>
        )}
      </Container>
      <CustomFooter />
    </div>
  );
};

export default SearchResults;
