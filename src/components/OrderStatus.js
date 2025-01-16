import React, { useState, useEffect } from "react";
import { db } from '../firebaseConfig';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { auth } from '../firebaseConfig';

function OrderStatus() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    // Query orders for current user
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, where('resident', '==', currentUser.displayName));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Sort orders by timestamp (newest first)
      const sortedOrders = ordersList.sort((a, b) => 
        new Date(b.timestamp) - new Date(a.timestamp)
      );

      setOrders(sortedOrders);
    });

    return () => unsubscribe();
  }, []);

  const getStatusStyle = (status) => {
    switch(status) {
      case 'Approved':
        return { backgroundColor: '#e6ffe6' }; // light green
      case 'Rejected':
        return { backgroundColor: '#ffe6e6' }; // light red
      default:
        return {}; // default white background
    }
  };

  return (
    <div>
      <h2>Order Status</h2>
      {orders.length === 0 ? (
        <p>You have no orders yet.</p>
      ) : (
        orders.map((order) => (
          <div 
            key={order.id} 
            style={{
              border: "1px solid gray", 
              margin: "10px", 
              padding: "10px",
              ...getStatusStyle(order.status)
            }}
          >
            <p>Order ID: {order.id}</p>
            <p>Status: {order.status}</p>
            {order.estimatedTime && <p>Estimated Time: {order.estimatedTime}</p>}
            <div>
              <h4>Items:</h4>
              <ul>
                {order.items.map((item, index) => (
                  <li key={index}>
                    {item.name} (x{item.quantity})
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default OrderStatus;
