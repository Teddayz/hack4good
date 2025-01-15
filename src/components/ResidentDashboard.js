import React, { useState } from "react";
import ProductCatalog from "./ProductCatalog";
import Cart from "./Cart";
import OrderStatus from "./OrderStatus";
import "./ResidentDashboard.css"; 
import { saveOrderToFirestore } from '../firebaseConfig'; // Import Firestore function
import { auth } from '../firebaseConfig'; // Import auth to get user info

function ResidentDashboard() {
  const [currentTab, setCurrentTab] = useState("catalog");
  const [cartItems, setCartItems] = useState([]);

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
    alert(`${product.name} added to the cart!`);
  };

  const removeFromCart = (productId) => {
    setCartItems(cartItems.filter((item) => item.id !== productId));
  };

  const submitOrder = async () => {
    if (cartItems.length === 0) {
        alert("Your cart is empty! Please add some items before submitting.");
        return; 
    }

    const currentUser = auth.currentUser;
    const order = {
        resident: currentUser && currentUser.displayName ? currentUser.displayName : "Guest",
        items: cartItems.map((item) => ({
            name: item.name,
            quantity: item.quantity,
        })),
    };

    try {
        await saveOrderToFirestore(order); // Save the order to Firestore
        alert("Order submitted successfully!");
        setCartItems([]); // Clear the cart
        setCurrentTab("status"); // Switch to the status tab
    } catch (error) {
        console.error("Error submitting order:", error);
        alert("Failed to submit order. Please try again.");
    }
};


  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <button
          className={`nav-button ${currentTab === "catalog" ? "active" : ""}`}
          onClick={() => setCurrentTab("catalog")}
        >
          Catalog
        </button>
        <button
          className={`nav-button ${currentTab === "cart" ? "active" : ""}`}
          onClick={() => setCurrentTab("cart")}
        >
          Cart ({cartItems.length})
        </button>
        <button
          className={`nav-button ${currentTab === "status" ? "active" : ""}`}
          onClick={() => setCurrentTab("status")}
        >
          Order Status
        </button>
      </nav>

      <main className="dashboard-main">
        {currentTab === "catalog" && <ProductCatalog addToCart={addToCart} />}
        {currentTab === "cart" && (
          <Cart
            cartItems={cartItems}
            removeFromCart={removeFromCart}
            submitOrder={submitOrder}  // Submit order to Firestore
          />
        )}
        {currentTab === "status" && <OrderStatus />}
      </main>
    </div>
  );
}

export default ResidentDashboard;
