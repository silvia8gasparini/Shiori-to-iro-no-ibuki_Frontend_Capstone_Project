import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import ColorDetails from "./pages/ColorDetails";
import BookDetails from "./pages/BookDetails";
import Tearoom from "./pages/Tearoom";
import SignUp from "./pages/SignUp";
import Login from "./pages/LogIn";
import UserProfile from "./pages/UserProfile";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "./redux/userSlice";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    const storedUser = localStorage.getItem("userData");

    if (token && storedUser) {
      dispatch(loginSuccess(JSON.parse(storedUser)));
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/color-details" element={<ColorDetails />} />
        <Route path="/books/:id" element={<BookDetails />} />
        <Route path="/tea-room" element={<Tearoom />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/user/profile" element={<UserProfile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
