import React, { useEffect, useState } from "react";
import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import "./ProductCatalog.css"; 

// const dummyProducts = [
//   { id: 1, name: "Apples", price: 1.5 },
//   { id: 2, name: "Bananas", price: 0.8 },
//   { id: 3, name: "Carrots", price: 1.2 },
// ];

function ProductCatalog({ addToCart }) {

  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const productList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productList);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="product-catalog">
      <h2>Catalog</h2>
      <div className="catalog-grid">
        {products.map((product) => (
          <div className="product-card" key={product.id}>
            <img
              src={product.image || "https://via.placeholder.com/150"} // Use a placeholder image if none is provided
              alt={product.name}
              className="product-image"
            />
            <h3 className="product-name">{product.name}</h3>
            <p className="product-price">Price: ${product.price.toFixed(2)}</p>
            <button
              className="add-to-cart-button"
              onClick={() => addToCart(product)}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductCatalog;
