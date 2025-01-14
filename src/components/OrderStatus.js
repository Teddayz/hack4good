import React, { useState, useEffect } from "react";

function OrderStatus() {
  const [orders, setOrders] = useState([
    { id: 1, status: "Pending", estimatedTime: null },
    { id: 2, status: "Pending", estimatedTime: null },
  ]);

  // Simulate fetching updates from the admin
  useEffect(() => {
    const interval = setInterval(() => {
      // Mocking admin updates
      const updatedOrders = orders.map((order) =>
        order.id === 1
          ? { ...order, status: "Approved", estimatedTime: "30 minutes" }
          : order
      );
      setOrders(updatedOrders);
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [orders]);

  return (
    <div>
      <h2>Order Status</h2>
      {orders.length === 0 ? (
        <p>You have no orders yet.</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} style={{ border: "1px solid gray", margin: "10px", padding: "10px" }}>
            <p>Order ID: {order.id}</p>
            <p>Status: {order.status}</p>
            {order.estimatedTime && <p>Estimated Time: {order.estimatedTime}</p>}
          </div>
        ))
      )}
    </div>
  );
}

export default OrderStatus;
