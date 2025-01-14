import React from "react";

const dummyProducts = [
  { id: 1, name: "Apples", price: 1.5 },
  { id: 2, name: "Bananas", price: 0.8 },
  { id: 3, name: "Carrots", price: 1.2 },
];

function ProductCatalog({ addToCart }) {
  return (
    <div>
      <h2>Product Catalog</h2>
      <div>
        {dummyProducts.map((product) => (
          <div key={product.id}>
            <h3>{product.name}</h3>
            <p>Price: ${product.price}</p>
            <button onClick={() => addToCart(product)}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductCatalog;
