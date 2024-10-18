import React, { useState, useEffect } from 'react';
import ProductForm from './components/ProductForm';
import ProductList from './components/ProductList';
import './components/styles.css';

const App = () => {
  const [products, setProducts] = useState([]);
  const [productToEdit, setProductToEdit] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5008/products');
        const data = await response.json();
        setProducts(data); 
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  const addProduct = async (product) => {
    try {
      const response = await fetch('http://localhost:5008/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      });
      const newProduct = await response.json();
      setProducts([...products, newProduct]);
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const editProduct = async (product) => {
    try {
      const response = await fetch(`http://localhost:5008/products/${product._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      });
      const updatedProduct = await response.json();
      setProducts(products.map((p) => (p._id === updatedProduct._id ? updatedProduct : p)));
      setProductToEdit(null);
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await fetch(`http://localhost:5008/products/${id}`, { method: 'DELETE' });
      setProducts(products.filter((product) => product._id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div className="app">
      <h1>Product Management</h1>
      <div className="layout-container">
        {/* Left side: Product Form */}
        <div className="form-container">
          <ProductForm 
            addProduct={addProduct} 
            editProduct={editProduct} 
            productToEdit={productToEdit} 
          />
        </div>

        {/* Right side: Product List */}
        <div className="product-list-container">
          <ProductList
            products={products}
            editProduct={setProductToEdit}
            deleteProduct={deleteProduct}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
