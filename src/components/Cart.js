import React from "react";

function Cart({ cartItems, removeFromCart, submitOrder }) {
  const handleSubmitOrder = async () => {
    try {
      const newRequest = {
        resident: "John Doe", // This should come from your auth/user state
        items: cartItems.map(item => ({
          name: item.name,
          quantity: item.quantity
        })),
        status: "Pending"
      };

      const response = await fetch('http://localhost:3001/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRequest)
      });

      if (response.ok) {
        alert('Order submitted successfully!');
        // Clear cart or redirect user
      } else {
        alert('Failed to submit order');
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('Error submitting order');
    }
  };

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
        <button onClick={handleSubmitOrder}>Place Order</button>
      )}
    </div>
  );
}

export default Cart;