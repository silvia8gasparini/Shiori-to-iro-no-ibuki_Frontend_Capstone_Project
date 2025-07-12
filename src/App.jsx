import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";

import Homepage from "./pages/Homepage";
import ColorDetails from "./pages/ColorDetails";
import BookDetails from "./pages/BookDetails";
import Tearoom from "./pages/Tearoom";
import SignUp from "./pages/SignUp";
import Login from "./pages/LogIn";
import UserPage from "./pages/UserPage";
import UserProfile from "./pages/UserProfile";

import { loginSuccess, setFavorites, setCartItems } from "./redux/userSlice";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    const storedUser = localStorage.getItem("userData");

    if (token && storedUser) {
      const parsedUser = JSON.parse(storedUser);
      dispatch(loginSuccess(parsedUser));

      const storedFavorites = localStorage.getItem(
        `favorites_${parsedUser.id}`
      );
      if (storedFavorites) {
        dispatch(setFavorites(JSON.parse(storedFavorites)));
      }

      const storedCartItems = localStorage.getItem(
        `cartItems_${parsedUser.id}`
      );
      if (storedCartItems) {
        dispatch(setCartItems(JSON.parse(storedCartItems)));
      }

      localStorage.removeItem("favorites");
      localStorage.removeItem("cartItems");
    }
  }, [dispatch]);

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
        <Route path="/user/page" element={<UserPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
