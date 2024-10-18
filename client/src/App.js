import React, { useState, useEffect } from 'react';
import ProductForm from './components/ProductForm';
import ProductList from './components/ProductList';
import './components/styles.css';

const App = () => {
  const [products, setProducts] = useState([]);
  const [productToEdit, setProductToEdit] = useState(null);

  // Fetch products from the server when the app loads
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5008/products');
        const data = await response.json();
        console.log("Fetched products:", data); // Log the fetched products
        setProducts(data); // Set the products in the state
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []); // Only run this once on mount

  // Add product
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
      setProducts([...products, newProduct]); // Add the new product to the local state
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  // Edit product
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
      setProductToEdit(null); // Clear form after updating
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  // Delete product
  const deleteProduct = async (id) => {
    try {
      await fetch(`http://localhost:5008/products/${id}`, { method: 'DELETE' });
      setProducts(products.filter((product) => product._id !== id)); // Remove from state
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div className="app">
      <h1>Product Management</h1>
      {/* Use ProductForm to either add or edit a product */}
      <ProductForm 
        addProduct={addProduct} 
        editProduct={editProduct} 
        productToEdit={productToEdit} 
      />

      {/* ProductList to display all products */}
      <ProductList
        products={products}
        editProduct={setProductToEdit}  // Pass the product to the form for editing
        deleteProduct={deleteProduct}
      />
    </div>
  );
};

export default App;
