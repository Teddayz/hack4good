import React from "react";

function Cart({ cartItems, removeFromCart, submitOrder }) {
  return (
    <div>
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul>
          {cartItems.map((item) => (
            <li key={item.id}>
              {item.name} (x{item.quantity})
              <button onClick={() => removeFromCart(item.id)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
      {cartItems.length > 0 && (
        <button onClick={submitOrder}>Place Order</button>
      )}
    </div>
  );
}

export default Cart;
