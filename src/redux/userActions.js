import {
  setReservations,
  setFavorites,
  logout,
  addReservation,
  setBorrows
} from "./Userslice";
import { setCartItems } from "./Cartslice";

// Utility per fetch autenticato
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

// FETCH prenotazioni utente
export const fetchReservations = () => async (dispatch, getState) => {
  const userId = getState().user.user?.id;
  try {
    const res = await authFetch(`${
          import.meta.env.VITE_API_BASE_URL
        }/reservations/me`);

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Errore HTTP:", res.status, errorText);
      throw new Error("Errore nel recupero delle prenotazioni");
    }

    const data = await res.json();
    if (!data.content) throw new Error("Formato risposta inatteso");

    dispatch(setReservations(data.content));
    localStorage.setItem(`reservations_${userId}`, JSON.stringify(data.content));
  } catch (error) {
    console.error("Reservations fetch error:", error);
    const fallback = localStorage.getItem(`reservations_${userId}`);
    if (fallback) {
      dispatch(setReservations(JSON.parse(fallback)));
    }
  }
};

// CREA nuova prenotazione
export const createReservation = (slot, zoneId) => async (dispatch, getState) => {
  const { user } = getState().user;

  console.log("User al momento della prenotazione:", user);

  if (!user || !user.digitalCard) {
    console.error("DigitalCard mancante! Impossibile prenotare.");
    return;
  }

  const payload = {
    date: slot.date,
    timeSlot: slot.timeSlot,
    userId: user.id,
    digitalCard: user.digitalCard.cardNumber,
    digitalCardId: user.digitalCard.id
  };

  console.log("Payload inviato per prenotazione:", payload);
  console.log("ID tessera usato:", user.digitalCard.id);

  try {
    const res = await authFetch(
      `${
          import.meta.env.VITE_API_BASE_URL
        }/reservations?zoneId=${zoneId}`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Errore backend: ${res.status} - ${errText}`);
    }

    const newReservation = await res.json();
    dispatch(addReservation(newReservation));
    console.log("Prenotazione salvata con successo:", newReservation);
  } catch (error) {
    console.error("Errore creazione prenotazione:", error);
  }
};

// RIMUOVI prenotazione
export const removeReservation = (id) => async (dispatch, getState) => {
  const token = localStorage.getItem("jwtToken");
  const userId = getState().user.user?.id;

  try {
    const res = await fetch(`${
          import.meta.env.VITE_API_BASE_URL
        }/reservations/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Errore nella cancellazione della prenotazione");

    const updated = getState().user.reservations.filter((r) => r.id !== id);
    dispatch(setReservations(updated));
    localStorage.setItem(`reservations_${userId}`, JSON.stringify(updated));
  } catch (err) {
    console.error("Errore deleteReservation:", err);
  }
};

// FETCH preferiti
export const fetchFavorites = () => async (dispatch, getState) => {
  const userId = getState().user.user?.id;
  try {
    const res = await authFetch(`${
          import.meta.env.VITE_API_BASE_URL
        }/favorites/me`);
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

// AGGIUNGI preferito
export const addFavorite = (book) => async (dispatch, getState) => {
  const { user, favorites } = getState().user;
  if (!user) return;

  try {
    const res = await authFetch(`${
          import.meta.env.VITE_API_BASE_URL
        }/favorites/add/${book.id}`, {
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

// RIMUOVI preferito
export const removeFavorite = (bookId) => async (dispatch, getState) => {
  const { user, favorites } = getState().user;
  if (!user || !bookId) return;

  try {
    const res = await authFetch(`${
          import.meta.env.VITE_API_BASE_URL
        }/favorites/remove/${bookId}`, {
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

// FETCH carrello
export const fetchCartItems = () => async (dispatch, getState) => {
  const userId = getState().user.user?.id;
  if (!userId) return;
  try {
    const res = await authFetch(`${
          import.meta.env.VITE_API_BASE_URL
        }/cart-items/me`);
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

// FETCH prestiti
export const fetchBorrows = () => async (dispatch, getState) => {
  const user = getState().user.user;
  const userId = user?.id;
  const cardId = user?.digitalCard?.id;

  if (!cardId) return;

  try {
    const res = await authFetch(`${
          import.meta.env.VITE_API_BASE_URL
        }/borrows/card/${cardId}`);

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Errore HTTP:", res.status, errorText);
      throw new Error("Errore nel recupero dei prestiti");
    }

    const data = await res.json();
    if (!data.content) throw new Error("Formato risposta inatteso");

    dispatch(setBorrows(data.content));
    localStorage.setItem(`borrows_${userId}`, JSON.stringify(data.content));
  } catch (error) {
    console.error("Borrows fetch error:", error);
    const fallback = localStorage.getItem(`borrows_${userId}`);
    if (fallback) {
      dispatch(setBorrows(JSON.parse(fallback)));
    }
  }
};

// AGGIUNGI prestito
export const addBorrow = (borrowData) => async (dispatch, getState) => {
  const { user, borrows } = getState().user;
  if (!user) return;

  try {
    const res = await authFetch(`${
          import.meta.env.VITE_API_BASE_URL
        }/borrows`, {
      method: "POST",
      body: JSON.stringify(borrowData),
    });

    if (!res.ok) throw new Error("Errore nell'aggiunta del prestito");

    const newBorrow = await res.json();
    const updated = [...borrows, newBorrow];

    dispatch(setBorrows(updated));
    localStorage.setItem(`borrows_${user.id}`, JSON.stringify(updated));
  } catch (error) {
    console.error("Errore addBorrow:", error);
  }
};

// RIMUOVI prestito
export const removeBorrow = (borrowId) => async (dispatch, getState) => {
  const { user, borrows } = getState().user;
  if (!user || !borrowId) return;

  try {
    const res = await authFetch(`${
          import.meta.env.VITE_API_BASE_URL
        }/borrows/${borrowId}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Errore nella rimozione del prestito");

    const updated = borrows.filter((b) => b.id !== borrowId);

    dispatch(setBorrows(updated));
    localStorage.setItem(`borrows_${user.id}`, JSON.stringify(updated));
  } catch (error) {
    console.error("Errore removeBorrow:", error);
  }
};

// LOGOUT
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
