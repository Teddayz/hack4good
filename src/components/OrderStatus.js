import React, { useState, useEffect } from "react";
import { db } from '../firebaseConfig';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { auth } from '../firebaseConfig';
import "./OrderStatus.css";

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

  const getStatusClass = (status) => {
    switch(status) {
      case 'Approved':
        return "status-approved";
      case 'Rejected':
        return "status-rejected";
      default:
        return "status-pending";
    }
  };

  return (
    <div className="order-status-container">
      <h2>Order Status</h2>
      {orders.length === 0 ? (
        <p>You have no orders yet.</p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div 
              className={`order-card ${getStatusClass(order.status)}`}
              key={order.id}
            >
              <p><strong>Order ID:</strong> {order.id}</p>
              <p><strong>Status:</strong> {order.status}</p>
              {order.estimatedTime && (
                <p><strong>Estimated Time:</strong> {order.estimatedTime}</p>
              )}
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
          ))}
        </div>
      )}
    </div>
  );
}

export default OrderStatus;
