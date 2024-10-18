import React, { useState } from 'react';
import './ProductList.css';
import SearchBar from './SearchBar'; // Import the SearchBar component

const ProductList = ({ products, editProduct, deleteProduct }) => {
  const [showList, setShowList] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); // State for search term

  const toggleListVisibility = () => {
    setShowList(!showList); // Toggle product list visibility
  };

  // Filter products based on the search term
  const filteredProducts = products.filter(product =>
    product.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="product-list-wrapper">
      <button onClick={toggleListVisibility}>
        {showList ? 'Hide Products' : 'Show Products'}
      </button>
      {showList && (
        <>
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} /> {/* Display SearchBar */}
          <ul className={`product-list ${showList ? 'show-product-list' : ''}`}>
            {filteredProducts.map((product) => (
              <li 
                key={product._id} 
                className="product-item"
                onClick={() => editProduct(product)}
              >
                <p><strong>{product.productName}</strong></p>
                <p>SKU: {product.productSKU}</p>
                <p>Marketing Date: {new Date(product.marketingDate).toLocaleDateString()}</p>
                <button onClick={(e) => { e.stopPropagation(); deleteProduct(product._id); }}>Delete</button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default ProductList;
