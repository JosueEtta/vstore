# Redux Cart Documentation

This document explains the Redux-based cart implementation used by the frontend and what it is responsible for.

## Overview

The shopping cart is now managed through a shared Redux-style state store so every page can read and update the same cart information.

This is useful because:

- the cart badge at the top navbar always shows the latest item count
- the modal cart drawer reflects the same shared data across pages
- home and product pages can add items to the same cart without maintaining separate local state

## Folder structure

The Redux-related files are stored here:

- `app/redux/cartSlice.js` — defines the cart behavior and actions
- `app/redux/store.js` — creates and exposes the cart store

## State shape

The cart state contains a single array named `items`.

```js
{
  items: [
    {
      id: 1,
      name: "Product Name",
      image: "/media/..",
      price: 5000,
      quantity: 2,
      stock: 10,
    },
  ],
}
```

### Meaning of the fields

- `items`: the list of products currently inside the cart
- `id`: the unique product identifier
- `name`: display name of the product
- `image`: product image path
- `price`: product price per unit
- `quantity`: number of units selected in the cart
- `stock`: copy of the available inventory count for the product

## Store file

The file [app/redux/store.js](app/redux/store.js) creates the store object that holds the cart state.

### What it does

1. Creates the cart store using a lightweight reducer-based store object.
2. Starts the store with the current persisted cart data from `localStorage`.
3. Subscribes to changes and writes the latest `items` array back into `localStorage` under the key `card`.

This makes the cart persistent across refreshes.

## Cart slice file

The file [app/redux/cartSlice.js](app/redux/cartSlice.js) contains the actual cart logic.

### Main exports

#### `getStoredCartItems()`

Reads the saved cart from `localStorage`.

- If no cart exists, it returns an empty array.
- If the stored content is invalid JSON, it safely falls back to an empty array.

#### `getProductCardKey(product)`

Creates a stable key for a product so the code can reliably match products in the cart.

It uses:

- `product.id`, if available
- otherwise a fallback made from the product name and image

#### `addToCart(product, quantity = 1)`

This action adds a product to the cart.

It performs the following:

- checks whether a product already exists in the cart
- if it already exists, it increases the quantity for that item
- if it does not exist, it adds the product with the requested quantity
- clamps the quantity against the product stock to prevent invalid values

#### `updateCartQuantity(productKey, quantity)`

This action updates the cart quantity of an existing product.

It ensures the item quantity is never lower than 1 and never above the available stock.

#### `removeFromCart(productKey)`

This action removes one product entry from the cart by matching its product key.

#### `hydrateCart(items = [])`

This action replaces the current in-memory cart state with the data that came from persisted storage.

## Reducer behavior

The default reducer in the slice handles these action types:

- `cart/addToCart`
- `cart/updateCartQuantity`
- `cart/removeFromCart`
- `cart/hydrateCart`

### Add-to-cart logic

When a product is added:

1. the product key is generated
2. the reducer checks whether that key already exists in `state.items`
3. if yes, it increments the `quantity`
4. if no, it inserts the product as a new cart item

### Quantity protection

The reducer keeps the cart safe by:

- using a minimum quantity of 1
- never exceeding the product stock count
- storing the stock count separately from the selected cart quantity

## How the provider is used

The top-level application in [app/root.tsx](app/root.tsx) wraps the route tree with the Redux provider.

That means all nested routes such as the home page and product listing page can read from the same global cart store.

## How the navbar uses the cart

The navbar in [app/component/navbar.jsx](app/component/navbar.jsx) reads the cart state from the store and displays:

- the cart item count badge in the top right corner
- the cart contents inside the modal drawer
- subtotal, transport fee, and total price calculations

The navbar also dispatches actions such as:

- `updateCartQuantity`
- `removeFromCart`

## What this Redux cart can do

The architecture currently supports these main capabilities:

- add one or more products to the cart
- prevent over-adding beyond stock quantity
- update the quantity directly inside the cart modal
- remove a product from the cart
- keep the cart visible in the navbar badge at all times
- persist the cart in browser storage so it survives refreshes
- synchronize the cart across multiple route components

## Typical usage

A page can dispatch actions like this:

```js
dispatch(addToCart(product, quantity))
```

To update the quantity:

```js
dispatch(updateCartQuantity(productKey, newQuantity))
```

To remove an item:

```js
dispatch(removeFromCart(productKey))
```

## Summary

The Redux cart implementation provides a single, shared, persistent source of truth for the shopping cart.

It is responsible for:

- cart state management
- cross-page synchronization
- quantity safeguards
- top navbar badge updates
- local storage persistence

This keeps the frontend cart behavior predictable and consistent across the home page, product list page, and navbar modal.
