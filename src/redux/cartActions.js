import { clearCart } from "./Cartslice";
import { setCartItems } from "./userSlice";

export const syncCartToBackend = () => async (dispatch, getState) => {
  const { cart, user } = getState();

  if (!user || !user.user) return;

  try {
    for (const item of cart.items) {
      await fetch(`http://localhost:8080/cart-items/book/${item.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          quantity: item.quantity,
          priceAtSelection: item.price,
        }),
      });
    }

    const res = await fetch("http://localhost:8080/cart-items/me", {
      credentials: "include",
    });

    const data = await res.json();
    console.log("Cart Items dal backend:", data);

    dispatch(setCartItems(data.content));
    dispatch(clearCart());
  } catch (error) {
    console.error("Errore durante la sincronizzazione del carrello:", error);
  }
};
