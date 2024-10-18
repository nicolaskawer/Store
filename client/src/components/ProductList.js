import React, { useState } from 'react';
import './ProductList.css';
const ProductList = ({ products, editProduct, deleteProduct }) => {
  const [showList, setShowList] = useState(false);

  const toggleListVisibility = () => {
    setShowList(!showList); // Toggle product list visibility
  };

  return (
    <div className="product-list-wrapper">
      <button onClick={toggleListVisibility}>
        {showList ? 'Hide Products' : 'Show Products'}
      </button>
      <ul className={`product-list ${showList ? 'show-product-list' : ''}`}>
        {products.map((product) => (
          <li 
            key={product._id} 
            className="product-item"
            onClick={() => editProduct(product)}
          >
            <p><strong>{product.productName}</strong></p>
            <p>SKU: {product.productSKU}</p>
            <button onClick={() => deleteProduct(product._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
