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

export const toggleFavorite = (book) => (dispatch, getState) => {
  const { user, favorites } = getState().user;
  if (!user) return;
  const exists = favorites.find((b) => b.id === book.id);
  const updated = exists
    ? favorites.filter((b) => b.id !== book.id)
    : [...favorites, book];
  dispatch(setFavorites(updated));
  localStorage.setItem(`favorites_${user.id}`, JSON.stringify(updated));
};

export const fetchCartItems = () => async (dispatch, getState) => {
  const userId = getState().user.user?.id;
  if (!userId) return;
  try {
    const res = await authFetch("http://localhost:8080/cart-items/me");
    if (!res.ok) throw new Error("Errore nel recupero del carrello");
    const data = await res.json();
    dispatch(setCartItems(data.content));
    localStorage.setItem(`cartItems_${userId}`, JSON.stringify(data.content));
  } catch (error) {
    console.error("Cart fetch error:", error);
    const fallback = localStorage.getItem(`cartItems_${userId}`);
    if (fallback) dispatch(setCartItems(JSON.parse(fallback)));
  }
};

export const syncCartToBackend = () => async (_dispatch, getState) => {
  const state = getState();
  const userId = state.user.user?.id;
  const cartItems = state.user.cartItems;
  if (!userId || !cartItems?.length) return;

  for (const item of cartItems) {
    try {
      const res = await fetch(`http://localhost:8080/cart-items/book/${item.id}`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
  },
  body: JSON.stringify({
    quantity: item.quantity,
    priceAtSelection: item.price,
  }),
});
      if (!res.ok) throw new Error(`Errore per ${item.title}`);
    } catch (err) {
      console.error("Errore sincronizzazione carrello:", err);
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
