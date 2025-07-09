import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

import { fetchColorByMicroSeasonId } from "../redux/selectedColorSlice";
import { fetchBooksByMicroSeasonId } from "../redux/booksSlice";

import CustomNavbar from "../components/CustomNavbar";
import CustomFooter from "../components/CustomFooter";
import Welcome from "../components/Welcome";
import ColorSection from "../components/ColorSection";
import BookSection from "../components/BookSection";

export default function Homepage() {
  const dispatch = useDispatch();

  const microSeasonId = useSelector(
    (state) => state.currentMicroSeason.microSeason?.id
  );

  useEffect(() => {
    if (microSeasonId) {
      dispatch(fetchColorByMicroSeasonId(microSeasonId));
      dispatch(fetchBooksByMicroSeasonId(microSeasonId));
    }
  }, [dispatch, microSeasonId]);

  return (
    <div className="d-flex flex-column" style={{ minHeight: "100vh" }}>
      <CustomNavbar />
      <Container fluid className="flex-grow-1 px-4">
        <Welcome />
        <ColorSection />
        {microSeasonId && <BookSection microSeasonId={microSeasonId} />}
      </Container>
      <CustomFooter />
    </div>
  );
}
