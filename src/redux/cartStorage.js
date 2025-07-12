export const loadCartState = () => {
  try {
    const serializedState = localStorage.getItem("cart");
    if (serializedState === null) return undefined;
    return JSON.parse(serializedState);
  } catch (err) {
    console.error("Errore nel caricamento del carrello:", err);
    return undefined;
  }
};

export const saveCartState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("cart", serializedState);
  } catch (err) {
    console.error("Errore nel salvataggio del carrello:", err);
  }
};
