import {
  setCartItems,
  setReservations,
  setFavorites,
  logout
} from "./userSlice";
import { clearCart } from "./Cartslice";

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

export const fetchDigitalCard = () => async (dispatch) => {
  try {
    const res = await authFetch(`http://localhost:8080/digital-cards/me`);
    if (!res.ok) throw new Error("Errore nel recupero tessera digitale");
    const data = await res.json();
    dispatch({ type: "SET_DIGITAL_CARD", payload: data });
  } catch (error) {
    console.error("Errore tessera:", error);
  }
};

export const fetchReservations = () => async (dispatch, getState) => {
  const userId = getState().user.user?.id;
  try {
    const res = await authFetch(`http://localhost:8080/reservations/me`);
    if (!res.ok) throw new Error("Errore nel recupero delle prenotazioni");
    const data = await res.json();
    dispatch(setReservations(data.content));

    if (userId) {
      localStorage.setItem(`reservations_${userId}`, JSON.stringify(data.content));
    }
  } catch (error) {
    console.error("Reservations fetch error:", error);

    if (userId) {
      const localData = localStorage.getItem(`reservations_${userId}`);
      if (localData) {
        dispatch(setReservations(JSON.parse(localData)));
      }
    }
  }
};

export const fetchFavorites = () => async (dispatch, getState) => {
  const userId = getState().user.user?.id;
  try {
    const res = await authFetch(`http://localhost:8080/favorites/me`);
    if (!res.ok) throw new Error("Errore nel recupero dei preferiti");
    const data = await res.json();

    if (Array.isArray(data) && data.length > 0) {
      dispatch(setFavorites(data));
      if (userId) {
        localStorage.setItem(`favorites_${userId}`, JSON.stringify(data));
      }
    } else {
      const localData = localStorage.getItem(`favorites_${userId}`);
      if (localData) {
        dispatch(setFavorites(JSON.parse(localData)));
      } else {
        dispatch(setFavorites([]));
      }
    }
  } catch (error) {
    console.error("Favorites fetch error:", error);
    if (userId) {
      const localData = localStorage.getItem(`favorites_${userId}`);
      if (localData) {
        dispatch(setFavorites(JSON.parse(localData)));
      } else {
        dispatch(setFavorites([]));
      }
    } else {
      dispatch(setFavorites([]));
    }
  }
};



export const toggleFavorite = (book) => (dispatch, getState) => {
  const { user, favorites } = getState().user;
  if (!user) return;

  const { id, title, author } = book;
  const exists = favorites.find((b) => b.id === id);
  const updated = exists
    ? favorites.filter((b) => b.id !== id)
    : [...favorites, { id, title, author }];

  dispatch(setFavorites(updated));
  localStorage.setItem(`favorites_${user.id}`, JSON.stringify(updated));
};


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

export const fetchCartItems = () => async (dispatch, getState) => {
  const userId = getState().user.user?.id;
  if (!userId) return;

  try {
    const res = await authFetch("http://localhost:8080/cart-items/me");
    if (!res.ok) throw new Error("Errore nel recupero degli articoli del carrello");
    const data = await res.json();
    dispatch(setCartItems(data.content));
    localStorage.setItem(`cartItems_${userId}`, JSON.stringify(data.content));
  } catch (error) {
    console.error("Fetch cart items error:", error);

    const localData = localStorage.getItem(`cartItems_${userId}`);
    if (localData) {
      dispatch(setCartItems(JSON.parse(localData)));
    }
  }
};

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


export const performLogout = () => (dispatch) => {
   dispatch(clearCart());
  dispatch(logout());
};