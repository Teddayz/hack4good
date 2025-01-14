import React, { useState } from "react";
import ProductCatalog from "./ProductCatalog";
import Cart from "./Cart";
import OrderStatus from "./OrderStatus";

function ResidentDashboard() {
  const [currentTab, setCurrentTab] = useState("catalog"); // Tracks the active tab
  const [cartItems, setCartItems] = useState([]); // Tracks items added to the cart

  // Adds a product to the cart
  const addToCart = (product) => {
    const existingProduct = cartItems.find((item) => item.id === product.id);
    if (existingProduct) {
      setCartItems(
        cartItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  // Removes an item from the cart
  const removeFromCart = (productId) => {
    setCartItems(cartItems.filter((item) => item.id !== productId));
  };

  // Submits the cart as an order
  const submitOrder = () => {
    const order = {
      resident: "John Doe", // Replace with dynamic resident information if available
      items: cartItems.map((item) => ({
        name: item.name,
        quantity: item.quantity,
      })),
      status: "Pending",
    };

    fetch("http://localhost:3000/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    })
      .then((response) => {
        if (response.ok) {
          alert("Order submitted successfully!");
          setCartItems([]); // Clear the cart
          setCurrentTab("status"); // Navigate to the Order Status tab
        } else {
          alert("Failed to submit order. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Error submitting order:", error);
        alert("Error submitting order. Please try again.");
      });
  };

  return (
    <div>
      <nav>
        <button onClick={() => setCurrentTab("catalog")}>Catalog</button>
        <button onClick={() => setCurrentTab("cart")}>Cart</button>
        <button onClick={() => setCurrentTab("status")}>Order Status</button>
      </nav>

      <main>
        {currentTab === "catalog" && <ProductCatalog addToCart={addToCart} />}
        {currentTab === "cart" && (
          <Cart
            cartItems={cartItems}
            removeFromCart={removeFromCart}
            submitOrder={submitOrder}
          />
        )}
        {currentTab === "status" && <OrderStatus />}
      </main>
    </div>
  );
}

export default ResidentDashboard;
