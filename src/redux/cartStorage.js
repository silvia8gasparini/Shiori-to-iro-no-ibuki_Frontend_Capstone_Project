export const loadCartState = (userId) => {
  const id = typeof userId === "object" ? userId?.id : userId;
  if (!id) return undefined;
  try {
    const serializedState = localStorage.getItem(`cartItems_${id}`);
    if (serializedState === null) return undefined;
    return JSON.parse(serializedState);
  } catch (err) {
    console.error("Errore nel caricamento del carrello:", err);
    return undefined;
  }
};

export const saveCartState = (userId, state) => {
  const id = typeof userId === "object" ? userId?.id : userId;
  if (!id) return;
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(`cartItems_${id}`, serializedState);
  } catch (err) {
    console.error("Errore nel salvataggio del carrello:", err);
  }
};
