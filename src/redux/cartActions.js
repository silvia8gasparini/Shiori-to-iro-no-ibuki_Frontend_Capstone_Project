import { clearCart, setCartItems } from "./Cartslice";

export const syncCartToBackend = () => async (dispatch, getState) => {
  const state = getState();
  const user = state.user.user;
  const cartItems = state.cart.items;

  if (!user) return;

  try {
    const token = localStorage.getItem("jwtToken");

    for (const item of cartItems) {
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/cart-items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bookId: item.id,
          quantity: item.quantity,
          priceAtSelection: item.price,
        }),
      });
    }

    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/cart-items/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

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
    dispatch(clearCart());


    localStorage.removeItem(`cartItems_${user.id}`);
  } catch (error) {
    console.error("Errore durante la sincronizzazione del carrello:", error);
  }
};

export const fetchUserCart = () => async (dispatch) => {
  const token = localStorage.getItem("jwtToken");

  if (!token) return;

  try {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/cart-items/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

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
  } catch (error) {
    console.error("Errore durante il fetch del carrello:", error);
  }
};

export const deleteCartItem = (cartItemId) => async (dispatch) => {
  const token = localStorage.getItem("jwtToken");
  try {
    const res = await fetch(`${
          import.meta.env.VITE_API_BASE_URL
        }/cart-items/${cartItemId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Errore nella rimozione dal carrello");

    dispatch(fetchUserCart());
  } catch (error) {
    console.error("Errore durante la cancellazione:", error);
  }
};


