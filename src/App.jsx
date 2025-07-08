import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
//import DetailsPage from "./components/DetailsPage";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        {/* <Route path="/details/:city" element={<DetailsPage />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
