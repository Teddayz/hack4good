import React, { useEffect, useState } from "react";

function AdminDashboard() {
  const [requests, setRequests] = useState([]);
  const [products, setProducts] = useState([]);

  // Fetch requests and products on component load
  useEffect(() => {
    fetch("http://localhost:5001/requests")
      .then((response) => response.json())
      .then((data) => setRequests(data))
      .catch((error) => console.error("Error fetching requests:", error));

    fetch("http://localhost:5001/products")
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <section>
        <h2>Resident Requests</h2>
        <ul>
          {requests.map((request) => (
            <li key={request.id}>
              <strong>{request.resident}</strong>:{" "}
              {request.items.map((item) => `${item.name} (x${item.quantity})`).join(", ")}
              - <em>{request.status}</em>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2>Product Management</h2>
        <ul>
          {products.map((product) => (
            <li key={product.id}>
              {product.name} (${product.price})
            </li>
          ))}
        </ul>
        {/* Add functionality for adding/updating products */}
      </section>
    </div>
  );
}

export default AdminDashboard;
