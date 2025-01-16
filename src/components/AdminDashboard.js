import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebaseConfig';
import { collection, query, onSnapshot, doc, updateDoc, addDoc, getDocs } from 'firebase/firestore';
import { signOut } from 'firebase/auth';


function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [products, setProducts] = useState({});

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

  
  const addProduct = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "products"), {
        name,
        price: parseFloat(price),
      });
      setName("");
      setPrice("");
      alert("Product added successfully!");
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      const productsRef = collection(db, 'products');
      const productSnapshot = await getDocs(productsRef);
      const productData = productSnapshot.docs.reduce((acc, doc) => {
        acc[doc.id] = doc.data();
        return acc;
      }, {});
      setProducts(productData);
    };
    fetchProducts();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth); // Firebase sign-out method
      alert('Logged out successfully');
      // Optionally redirect to login page
      window.location.href = '/signin';  // Adjust the path as needed
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };
  

  return (
    <div>
      <h2>Admin Dashboard - Orders</h2>
      <div>
      <h2>Admin Dashboard</h2>
      <form onSubmit={addProduct}>
        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <button type="submit">Add Product</button>
      </form>
    </div>
        {/* Logout Button */}
        <button onClick={handleLogout}>Logout</button>
      
    

    {orders.map((order) => (
        <div key={order.id} style={{ border: '1px solid gray', margin: '10px', padding: '10px' }}>
          <p>Firestore ID: {order.id}</p>
          <p>Resident: {order.resident}</p>
          <p>Status: {order.status}</p>
          <div>
            <h4>Items:</h4>
            <ul>
              {order.items.map((item, index) => {
                const product = Object.values(products).find(
                  (product) => product.name === item.name
                );
                return (
                  <li key={index}>
                    {item.name} (x{item.quantity}) - ${product ? product.price.toFixed(2) : "N/A"}
                  </li>
                );
              })}
            </ul>
          </div>
          {order.status === 'Pending' && (
            <div>
              <button onClick={() => updateOrderStatus(order.id, 'Approved', null)}>
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
