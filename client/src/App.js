import React, { useState, useEffect } from 'react';
import ProductForm from './components/ProductForm';
import ProductList from './components/ProductList';
import './App.css';

const App = () => {
  const [products, setProducts] = useState([]);
  const [productToEdit, setProductToEdit] = useState(null);

  useEffect(() => {
    const fetchProducts = () => {
      fetch('http://localhost:5008/products')
        .then((response) => response.json())
        .then((data) => setProducts(data))
        .catch((error) => {
          console.error("Error fetching products:", error);
          alert("Failed to load products. Please check your internet connection.");
        });
    };
    fetchProducts();
  }, []);

  const addProduct = (product) => {
    fetch('http://localhost:5008/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    })
      .then((response) => response.json())
      .then((newProduct) => {
        setProducts([...products, newProduct]);
      })
      .catch((error) => {
        console.error("Error adding product:", error);
        alert("Failed to add product. Please check your internet connection.");
      });
  };

  const editProduct = (product) => {
    fetch(`http://localhost:5008/products/${product._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...product, 
        marketingDate: product.marketingDate || new Date().toISOString().split('T')[0], // Handle undefined dates
      }),
    })
      .then((response) => response.json())
      .then((updatedProduct) => {
        setProducts(products.map((p) => (p._id === updatedProduct._id ? updatedProduct : p)));
        setProductToEdit(null); // Clear edit mode
      })
      .catch((error) => {
        console.error("Error updating product:", error);
        alert("Failed to update product. Please check your internet connection.");
      });
  };
  
  const deleteProduct = (id) => {
    fetch(`http://localhost:5008/products/${id}`, { method: 'DELETE' })
      .then(() => {
        setProducts(products.filter((product) => product._id !== id));
      })
      .catch((error) => {
        console.error("Error deleting product:", error);
        alert("Failed to delete product. Please check your internet connection.");
      });
  };

  const cancelEdit = () => {
    setProductToEdit(null); // Clear edit mode on cancel
  };

  return (
    <div className="app">
      <h1>Product Management</h1>
      <div className="layout-container">
        <div className="form-container">
          <ProductForm 
            addProduct={addProduct} 
            editProduct={editProduct} 
            productToEdit={productToEdit} 
            cancelEdit={cancelEdit} // Pass cancel function to ProductForm
          />
        </div>
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
