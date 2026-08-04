import cartReducer, { getStoredCartItems } from "./cartSlice";

function createStore(reducer, preloadedState) {
  let state = preloadedState;
  const listeners = new Set();

  return {
    getState() {
      return state;
    },
    dispatch(action) {
      state = reducer(state, action);
      listeners.forEach((listener) => listener());
      return action;
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

const initialState = {
  items: getStoredCartItems(),
};

export const store = createStore(cartReducer, initialState);

if (typeof window !== "undefined") {
  store.subscribe(() => {
    window.localStorage.setItem("card", JSON.stringify(store.getState().items));
  });
}

export default store;
