import React from 'react';

const ProductList = ({ products, editProduct, deleteProduct }) => {
  return (
    <div>
      <h2>Product List</h2>
      <ul>
        {products.map((product) => (
          <li key={product._id}>
            <span>{product.productName} (SKU: {product.productSKU})</span>
            <button onClick={() => editProduct(product)}>Edit</button>
            <button onClick={() => deleteProduct(product._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
