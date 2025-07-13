import React, { useEffect, useState } from "react";
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

import {
  fetchCartItems,
  fetchFavorites,
  fetchReservations,
} from "./redux/userActions";

import { syncCartToBackend } from "./redux/cartActions";
import { loginSuccess } from "./redux/Userslice";
import { setCartItems } from "./redux/Cartslice";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  const dispatch = useDispatch();
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    const storedUser = localStorage.getItem("userData");

    const fetchAll = async () => {
      if (token && storedUser) {
        const parsedUser = JSON.parse(storedUser);
        dispatch(loginSuccess(parsedUser));
        await dispatch(syncCartToBackend());
        await dispatch(fetchCartItems());
        await dispatch(fetchFavorites());
        await dispatch(fetchReservations());
      } else {
        const guestCart = localStorage.getItem("cartItems");
        if (guestCart) {
          dispatch(setCartItems(JSON.parse(guestCart)));
        }
      }
      setIsDataLoaded(true);
    };

    fetchAll();
  }, [dispatch]);

  if (!isDataLoaded) return null;

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
