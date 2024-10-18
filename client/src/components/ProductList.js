import React, { useState, useEffect } from 'react';

const ProductList = ({ products, editProduct, deleteProduct }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(products);

  // Effect to update the filtered products whenever the search term or products change
  useEffect(() => {
    const sortedProducts = [...products].sort((a, b) => 
      a.productName.localeCompare(b.productName)
    );

    if (searchTerm) {
      setFilteredProducts(
        sortedProducts.filter(product => 
          product.productName.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredProducts(sortedProducts); // Show all products if no search term
    }
  }, [searchTerm, products]);

  return (
    <div>
      <h2>Product List</h2>

      {/* Search input */}
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search products by name"
        style={{ marginBottom: '10px', padding: '5px', width: '100%' }}
      />

      {/* Scrollable product list */}
      <div style={{ maxHeight: '400px', overflowY: 'scroll', border: '1px solid #ccc', padding: '10px' }}>
        <ul>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <li key={product._id} style={{ marginBottom: '10px' }}>
                <span>{product.productName} (SKU: {product.productSKU})</span>
                <button onClick={() => editProduct(product)} style={{ marginLeft: '10px' }}>Edit</button>
                <button onClick={() => deleteProduct(product._id)} style={{ marginLeft: '5px' }}>Delete</button>
              </li>
            ))
          ) : (
            <p>No products found.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ProductList;
