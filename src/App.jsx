import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
//import DetailsPage from "./components/DetailsPage";
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/style.css";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* <Route path="/details/:city" element={<DetailsPage />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
