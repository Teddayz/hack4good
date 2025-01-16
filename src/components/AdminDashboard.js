import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, query, onSnapshot, doc, updateDoc } from 'firebase/firestore';

function AdminDashboard() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersList = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }));

      // Sort orders: Pending first, then others
      const sortedOrders = ordersList.sort((a, b) => {
        if (a.status === 'Pending' && b.status !== 'Pending') return -1;
        if (a.status !== 'Pending' && b.status === 'Pending') return 1;
        // For non-pending orders, sort by timestamp (newest first)
        return new Date(b.timestamp) - new Date(a.timestamp);
      });

      setOrders(sortedOrders);
    });

    return () => unsubscribe();
  }, []);

  const updateOrderStatus = async (orderId, newStatus, estimatedTime) => {
    if (!orderId) {
      console.error('Invalid order ID');
      return;
    }
    
    try {
      console.log('Updating order with Firestore ID:', orderId);
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        status: newStatus,
        estimatedTime: estimatedTime,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error updating order: ", error.message);
      alert(`Failed to update order status: ${error.message}`);
    }
  };

  return (
    <div>
      <h2>Admin Dashboard - Orders</h2>
      {orders.map((order) => (
        <div key={order.id} style={{ border: '1px solid gray', margin: '10px', padding: '10px' }}>
          <p>Firestore ID: {order.id}</p>
          <p>Resident: {order.resident}</p>
          <p>Status: {order.status}</p>
          <div>
            <h4>Items:</h4>
            <ul>
              {order.items.map((item, index) => (
                <li key={index}>{item.name} (x{item.quantity})</li>
              ))}
            </ul>
          </div>
          {order.status === 'Pending' && (
            <div>
              <button onClick={() => updateOrderStatus(order.id, 'Approved', '30 minutes')}>
                Approve Order
              </button>
              <button onClick={() => updateOrderStatus(order.id, 'Rejected', null)}>
                Reject Order
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default AdminDashboard;
