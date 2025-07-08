import { Container } from "react-bootstrap";

const Welcome = () => (
  <Container
    className="welcome-section text-center mt-3
     rounded-5"
    style={{
      background: "radial-gradient(rgb(253, 235, 212)",
      color: "orange",
    }}
  >
    <div className="d-flex align-items-center justify-content-center gap-5 flex-wrap">
      <img
        src=""
        className="rounded-circle py-3 me-5"
        alt=""
        style={{
          height: "250px",
        }}
      />
      <div>
        <p className="fs-5"></p>{" "}
      </div>
    </div>
  </Container>
);

export default Welcome;
