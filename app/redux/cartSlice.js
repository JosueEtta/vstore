const CART_STORAGE_KEY = "card";

export function getStoredCartItems() {
  if (typeof window === "undefined") return [];

  const savedCard = window.localStorage.getItem(CART_STORAGE_KEY);
  if (!savedCard) return [];

  try {
    const parsedCard = JSON.parse(savedCard);
    return Array.isArray(parsedCard) ? parsedCard : [];
  } catch {
    return [];
  }
}

export const getProductCardKey = (product) =>
  product?.id ?? `${product?.name ?? "product"}-${product?.image ?? "image"}`;

const clampQuantity = (quantity, availableQuantity = 0) => {
  const parsedQuantity = Number(quantity) || 1;
  const safeQuantity = Math.max(1, parsedQuantity);

  if (availableQuantity > 0) {
    return Math.min(safeQuantity, availableQuantity);
  }

  return safeQuantity;
};

const initialState = {
  items: getStoredCartItems(),
};

export const addToCart = (product, quantity = 1) => ({
  type: "cart/addToCart",
  payload: { product, quantity },
});

export const updateCartQuantity = (productKey, quantity) => ({
  type: "cart/updateCartQuantity",
  payload: { productKey, quantity },
});

export const removeFromCart = (productKey) => ({
  type: "cart/removeFromCart",
  payload: productKey,
});

export const hydrateCart = (items = []) => ({
  type: "cart/hydrateCart",
  payload: items,
});

export default function cartReducer(state = initialState, action) {
  switch (action.type) {
    case "cart/hydrateCart": {
      return {
        ...state,
        items: Array.isArray(action.payload) ? action.payload : [],
      };
    }

    case "cart/addToCart": {
      const { product, quantity } = action.payload;
      const productKey = getProductCardKey(product);
      const availableStock = Number(product?.quantity) || 0;
      const quantityToAdd = clampQuantity(quantity, availableStock);

      if (!product || !productKey) {
        return state;
      }

      const productAlreadyInCart = state.items.some(
        (item) => getProductCardKey(item) === productKey
      );

      if (productAlreadyInCart) {
        return {
          ...state,
          items: state.items.map((item) => {
            if (getProductCardKey(item) !== productKey) return item;

            const currentQuantity = Number(item.quantity) || 0;
            const stock = Number(item.stock ?? item.quantity ?? 0) || 0;
            const nextQuantity = Math.min(currentQuantity + quantityToAdd, stock || currentQuantity + quantityToAdd);

            return {
              ...item,
              quantity: nextQuantity,
            };
          }),
        };
      }

      return {
        ...state,
        items: [
          ...state.items,
          {
            ...product,
            stock: availableStock,
            quantity: clampQuantity(quantityToAdd, availableStock),
          },
        ],
      };
    }

    case "cart/updateCartQuantity": {
      const { productKey, quantity } = action.payload;
      const normalizedQuantity = Number(quantity) || 1;
      const safeQuantity = Math.max(1, normalizedQuantity);

      return {
        ...state,
        items: state.items.map((item) => {
          if (getProductCardKey(item) !== productKey) return item;

          const stock = Number(item?.stock ?? item?.quantity ?? 0) || 0;
          const boundedQuantity = stock > 0 ? Math.min(safeQuantity, stock) : safeQuantity;

          return {
            ...item,
            quantity: boundedQuantity,
          };
        }),
      };
    }

    case "cart/removeFromCart": {
      return {
        ...state,
        items: state.items.filter((item) => getProductCardKey(item) !== action.payload),
      };
    }

    default:
      return state;
  }
}
