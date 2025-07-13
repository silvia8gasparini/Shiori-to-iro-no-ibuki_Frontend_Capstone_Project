import {
  setReservations,
  setFavorites,
  logout
} from "./Userslice";
import { setCartItems } from "./Cartslice";

const authFetch = (url, options = {}) => {
  const token = localStorage.getItem("jwtToken");
  return fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

export const fetchReservations = () => async (dispatch, getState) => {
  const userId = getState().user.user?.id;
  try {
    const res = await authFetch(`http://localhost:8080/reservations/me`);
    if (!res.ok) throw new Error("Errore nel recupero delle prenotazioni");
    const data = await res.json();
    dispatch(setReservations(data.content));
    localStorage.setItem(`reservations_${userId}`, JSON.stringify(data.content));
  } catch (error) {
    console.error("Reservations fetch error:", error);
    const fallback = localStorage.getItem(`reservations_${userId}`);
    if (fallback) dispatch(setReservations(JSON.parse(fallback)));
  }
};

export const fetchFavorites = () => async (dispatch, getState) => {
  const userId = getState().user.user?.id;
  try {
    const res = await authFetch(`http://localhost:8080/favorites/me`);
    if (!res.ok) throw new Error("Errore nel recupero dei preferiti");
    const data = await res.json();
    dispatch(setFavorites(data));
    localStorage.setItem(`favorites_${userId}`, JSON.stringify(data));
  } catch (error) {
    console.error("Favorites fetch error:", error);
    const fallback = localStorage.getItem(`favorites_${userId}`);
    if (fallback) dispatch(setFavorites(JSON.parse(fallback)));
  }
};

export const addFavorite = (book) => async (dispatch, getState) => {
  const { user, favorites } = getState().user;
  if (!user) return;

  try {
    const res = await authFetch(`http://localhost:8080/favorites/add/${book.id}`, {
      method: "POST",
    });
    if (!res.ok) throw new Error("Errore nell'aggiunta ai preferiti");

    const updated = [...favorites, book];
    dispatch(setFavorites(updated));
    localStorage.setItem(`favorites_${user.id}`, JSON.stringify(updated));
  } catch (error) {
    console.error("Errore addFavorite:", error);
  }
};

export const removeFavorite = (bookId) => async (dispatch, getState) => {
  const { user, favorites } = getState().user;
  if (!user || !bookId) return;

  try {
    const res = await authFetch(`http://localhost:8080/favorites/remove/${bookId}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Errore nella rimozione dai preferiti");

    const updated = favorites
      .filter((b) => b.bookId !== bookId)
      .map((fav) => ({ ...fav }));

    console.log("Nuovi preferiti dopo rimozione:", updated);

    dispatch(setFavorites(updated));
    localStorage.setItem(`favorites_${user.id}`, JSON.stringify(updated));
  } catch (error) {
    console.error("Errore removeFavorite:", error);
  }
};


export const fetchCartItems = () => async (dispatch, getState) => {
  const userId = getState().user.user?.id;
  if (!userId) return;
  try {
    const res = await authFetch("http://localhost:8080/cart-items/me");
    if (!res.ok) throw new Error("Errore nel recupero del carrello");
    const data = await res.json();

    const normalized = data.content.map((item) => ({
      id: item.id,
      title: item.bookTitle,
      author: item.bookAuthor,
      price: item.priceAtSelection,
      quantity: item.quantity,
    }));

    dispatch(setCartItems(normalized));
    localStorage.setItem(`cartItems_${userId}`, JSON.stringify(normalized));
  } catch (error) {
    console.error("Cart fetch error:", error);
    const fallback = localStorage.getItem(`cartItems_${userId}`);
    if (fallback) {
      const parsed = JSON.parse(fallback).map((item) => ({
        id: item.id,
        title: item.bookTitle || item.title,
        author: item.bookAuthor || item.author,
        price: item.priceAtSelection || item.price,
        quantity: item.quantity,
      }));
      dispatch(setCartItems(parsed));
    }
  }
};

export const performLogout = () => (dispatch, getState) => {
  const userId = getState().user.user?.id;
  dispatch(logout());

  localStorage.removeItem("jwtToken");
  localStorage.removeItem("userData");

  if (userId) {
    localStorage.removeItem(`cartItems_${userId}`);
    localStorage.removeItem(`favorites_${userId}`);
    localStorage.removeItem(`reservations_${userId}`);
  }
};
