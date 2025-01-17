import React from "react";
import "./Cart.css";

function Cart({ cartItems, removeFromCart, submitOrder }) {
  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="cart-list">
          {cartItems.map((item) => (
            <div className="cart-item" key={item.id}>
              <div className="cart-item-name">{item.name}</div>
              <div className="cart-item-quantity">Quantity: {item.quantity}</div>
              <button
                className="cart-item-remove"
                onClick={() => removeFromCart(item.id)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
      {cartItems.length > 0 && (
        <button className="place-order-button" onClick={() => submitOrder()}>
          Place Order
        </button>
      )}
    </div>
  );
}

export default Cart;
