import {
  setCartItems,
  setReservations,
  setFavorites,
} from "./userSlice";

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

// Tessera digitale
export const fetchDigitalCard = (userId) => async (dispatch) => {
  try {
    const res = await authFetch(`http://localhost:8080/digital-cards/by-user/${userId}`);
    if (!res.ok) throw new Error("Errore nel recupero tessera digitale");
    const data = await res.json();
    dispatch({ type: "SET_DIGITAL_CARD", payload: data });
  } catch (error) {
    console.error("Errore tessera:", error);
  }
};

// Prenotazioni
export const fetchReservations = (userId) => async (dispatch) => {
  try {
    const res = await authFetch(`http://localhost:8080/reservations/user/${userId}`);
    if (!res.ok) throw new Error("Errore nel recupero delle prenotazioni");
    const data = await res.json();
    dispatch(setReservations(data));
  } catch (error) {
    console.error("Reservations fetch error:", error);
  }
};

// Preferiti da backend
export const fetchFavorites = (userId) => async (dispatch) => {
  try {
    const res = await authFetch(`http://localhost:8080/user/${userId}/favorites`);
    if (!res.ok) throw new Error("Errore nel recupero dei preferiti");
    const data = await res.json();
    dispatch(setFavorites(data));
    localStorage.setItem("favorites", JSON.stringify(data));
  } catch (error) {
    console.error("Favorites fetch error:", error);
  }
};

// Toggle preferiti in localStorage
export const toggleFavorite = (book) => (dispatch, getState) => {
  const { id, title, author } = book;
  const currentFavorites = getState().user.favorites || [];
  const exists = currentFavorites.find((b) => b.id === id);

  const updatedFavorites = exists
    ? currentFavorites.filter((b) => b.id !== id)
    : [...currentFavorites, { id, title, author }];

  dispatch(setFavorites(updatedFavorites));
  localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
};

// Aggiungi al carrello
export const addToCart = (bookId, quantity, priceAtSelection) => async () => {
  try {
    const res = await authFetch(`http://localhost:8080/cart-items/book/${bookId}`, {
      method: "POST",
      body: JSON.stringify({ quantity, priceAtSelection }),
    });

    if (!res.ok) throw new Error("Errore nell'aggiunta al carrello");
    return await res.json();
  } catch (error) {
    console.error("Add to cart error:", error);
  }
};

// Recupera articoli del carrello
export const fetchCartItems = () => async (dispatch) => {
  try {
    const res = await authFetch("http://localhost:8080/cart-items/me");
    const text = await res.text();
    if (!res.ok) throw new Error("Errore nel recupero degli articoli del carrello");

    const data = JSON.parse(text);
    dispatch(setCartItems(data.content));
    localStorage.setItem("cartItems", JSON.stringify(data.content));
  } catch (error) {
    console.error("Fetch cart items error:", error);
  }
};

// Aggiorna un cartItem
export const updateCartItem = (id, quantity, priceAtSelection) => async () => {
  try {
    const res = await authFetch(`http://localhost:8080/cart-items/${id}`, {
      method: "PUT",
      body: JSON.stringify({ quantity, priceAtSelection }),
    });

    if (!res.ok) throw new Error("Errore nell'aggiornamento del carrello");
    return await res.json();
  } catch (error) {
    console.error("Update cart item error:", error);
  }
};

// Rimuovi un cartItem
export const deleteCartItem = (id) => async () => {
  try {
    const res = await authFetch(`http://localhost:8080/cart-items/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Errore nella rimozione dell'articolo dal carrello");
  } catch (error) {
    console.error("Delete cart item error:", error);
  }
};
