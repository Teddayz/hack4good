import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebaseConfig';
import { collection, query, onSnapshot, doc, updateDoc, addDoc, getDocs, deleteDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import './AdminDashboard.css';

function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  // Fetch orders from Firestore
  useEffect(() => {
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersList = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setOrders(ordersList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Fetch products from Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      const productsRef = collection(db, 'products');
      const productSnapshot = await getDocs(productsRef);
      const productData = productSnapshot.docs.reduce((acc, doc) => {
        acc[doc.id] = { id: doc.id, ...doc.data() };
        return acc;
      }, {});
      setProducts(productData);
    };
    fetchProducts();
  }, []);

  // Update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        status: newStatus,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error updating order:', error.message);
    }
  };

  // Add a new product
  const addProduct = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'products'), {
        name,
        price: parseFloat(price),
      });
      setName('');
      setPrice('');
      alert('Product added successfully!');
    } catch (error) {
      console.error('Error adding product:', error.message);
    }
  };

  // Delete a product
  const deleteProduct = async (productId) => {
    try {
      await deleteDoc(doc(db, 'products', productId));
      const updatedProducts = { ...products };
      delete updatedProducts[productId];
      setProducts(updatedProducts);
      alert('Product deleted successfully!');
    } catch (error) {
      console.error('Error deleting product:', error.message);
    }
  };

  // Filter orders by status
  const filteredOrders =
    filter === 'All'
      ? orders
      : orders.filter((order) => order.status === filter);

  // Logout function
  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = '/signin';
    } catch (error) {
      console.error('Logout failed:', error.message);
    }
  };

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h1>Admin Dashboard</h1>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <section className="product-section">
        <h2>Add Product</h2>
        <form className="product-form" onSubmit={addProduct}>
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

        <h2>Manage Products</h2>
        <div className="product-list">
          {Object.entries(products).map(([id, product]) => (
            <div key={id} className="product-card">
              <p>
                <strong>Name:</strong> {product.name}
              </p>
              <p>
                <strong>Price:</strong> ${product.price.toFixed(2)}
              </p>
              <button onClick={() => deleteProduct(id)} className="delete-button">
                Delete
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="orders-section">
        <h2>Orders</h2>
        <div className="filter-buttons">
          {['All', 'Pending', 'Approved', 'Rejected'].map((status) => (
            <button
              key={status}
              className={`filter-button ${filter === status ? 'active' : ''}`}
              onClick={() => setFilter(status)}
            >
              {status}
            </button>
          ))}
        </div>
        {loading ? (
          <p>Loading orders...</p>
        ) : filteredOrders.length === 0 ? (
          <p>No orders available</p>
        ) : (
          <div className="orders-container">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className={`order-card ${order.status ? order.status.toLowerCase() : ''}`}
              >
                <p>
                  <strong>Order ID:</strong> {order.id}
                </p>
                <p>
                  <strong>Resident:</strong> {order.resident}
                </p>
                <p>
                  <strong>Status:</strong>{' '}
                  <span className={`status-badge ${order.status?.toLowerCase() || ''}`}>
                    {order.status || 'Unknown'}
                  </span>
                </p>
                <h4>Items:</h4>
                <ul>
                  {order.items.map((item, index) => {
                    const product = Object.values(products).find(
                      (product) => product.name === item.name
                    );
                    return (
                      <li key={index}>
                        {item.name} (x{item.quantity}) - $
                        {product ? product.price.toFixed(2) : 'N/A'}
                      </li>
                    );
                  })}
                </ul>
                {order.status === 'Pending' && (
                  <div className="action-buttons">
                    <button onClick={() => updateOrderStatus(order.id, 'Approved')}>
                      Approve
                    </button>
                    <button onClick={() => updateOrderStatus(order.id, 'Rejected')}>
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default AdminDashboard;

