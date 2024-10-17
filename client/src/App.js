import React, { useState, useEffect } from 'react';
import ProductForm from './components/ProductForm';
import ProductList from './components/ProductList';
import SearchBar from './components/SearchBar';
import './components/styles.css';

const App = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [productToEdit, setProductToEdit] = useState(null);

  // Fetch products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch('http://localhost:5008/api/products');
      const data = await response.json();
      setProducts(data);
    };
    fetchProducts();
  }, []);

  const addProduct = async (product) => {
    const response = await fetch('http://localhost:5000/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    });
    const newProduct = await response.json();
    setProducts([...products, newProduct]);
  };

  const editProduct = async (product) => {
    const response = await fetch(`/api/products/${product._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    });
    const updatedProduct = await response.json();
    setProducts(products.map((p) => (p._id === updatedProduct._id ? updatedProduct : p)));
    setProductToEdit(null);
  };

  const deleteProduct = async (id) => {
    await fetch(`/api/products/${id}`, { method: 'DELETE' });
    setProducts(products.filter((product) => product._id !== id));
  };

  const filteredProducts = products.filter((product) =>
    product.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="app">
      <h1>Product Management</h1>
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <ProductForm addProduct={addProduct} editProduct={editProduct} productToEdit={productToEdit} />
      <ProductList
        products={filteredProducts}
        editProduct={setProductToEdit}
        deleteProduct={deleteProduct}
      />
    </div>
  );
};

export default App;
