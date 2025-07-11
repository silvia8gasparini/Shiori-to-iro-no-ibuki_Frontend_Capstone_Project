import { setCart, setReservations, setFavorites } from "./userSlice";

export const fetchCartItems = (userId) => async (dispatch) => {
  try {
    const res = await fetch(`/api/users/${userId}/cart`);
    if (!res.ok) throw new Error("Errore nel recupero del carrello");
    const data = await res.json();
    dispatch(setCart(data));
  } catch (error) {
    console.error("Cart fetch error:", error);
  }
};

export const fetchReservations = (userId) => async (dispatch) => {
  try {
    const res = await fetch(`/api/users/${userId}/reservations`);
    if (!res.ok) throw new Error("Errore nel recupero delle prenotazioni");
    const data = await res.json();
    dispatch(setReservations(data));
  } catch (error) {
    console.error("Reservations fetch error:", error);
  }
};

export const fetchFavorites = (userId) => async (dispatch) => {
  try {
    const res = await fetch(`/api/users/${userId}/favorites`);
    if (!res.ok) throw new Error("Errore nel recupero dei preferiti");
    const data = await res.json();
    dispatch(setFavorites(data));
  } catch (error) {
    console.error("Favorites fetch error:", error);
  }
};
