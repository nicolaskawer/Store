import React, { useState, useEffect } from 'react';
import ProductForm from './components/ProductForm';
import ProductList from './components/ProductList';
import './App.css';

const App = () => {
  const [products, setProducts] = useState([]);
  const [productToEdit, setProductToEdit] = useState(null);
  const [isServerRunning, setIsServerRunning] = useState(true); // Track server status
  const [successMessage, setSuccessMessage] = useState(''); // Define success message state

  useEffect(() => {
    const checkServerStatus = () => {
      fetch('http://localhost:5008/products')
        .then((response) => {
          if (!response.ok) {
            throw new Error('Server is down');
          }
          return response.json();
        })
        .then((data) => {
          setProducts(data);
          setIsServerRunning(true); // Server is running
        })
        .catch((error) => {
          console.error("Error fetching products:", error);
          setIsServerRunning(false); // Server is down
        });
    };
    checkServerStatus();
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
        setSuccessMessage('Product successfully added to the store!'); // Set success message

        // Hide the message after 3 seconds
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
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
        marketingDate: product.marketingDate || new Date().toISOString().split('T')[0],
      }),
    })
      .then((response) => response.json())
      .then((updatedProduct) => {
        setProducts(products.map((p) => (p._id === updatedProduct._id ? updatedProduct : p)));
        setProductToEdit(null);
        setSuccessMessage('Product successfully updated!'); // Set success message for update

        // Hide the message after 3 seconds
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
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
    setProductToEdit(null);
  };

  const handleExit = () => {
    const confirmExit = window.confirm("Are you sure you want to exit the application?");
    if (confirmExit) {
      alert("Thank you very much for using our site!");
      fetch('http://localhost:5008/shutdown', {
        method: 'POST',
      })
      .then((response) => {
        if (response.ok) {
          window.close();
        } else {
          throw new Error('Server shutdown failed');
        }
      })
      .catch((error) => {
        console.error("Error shutting down the server:", error);
        alert("Failed to shut down the server. Please close the window manually.");
      });
    }
  };

  if (!isServerRunning) {
    // Render empty interface if the server is not running
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>The server is not running. Please come back later.</div>;
  }

  return (
    <div className="app">
      <button onClick={handleExit} style={{ position: 'absolute', top: '20px', left: '20px' }}>
        Exit
      </button>
      <h1 className="main-title">Product Management</h1>
      <h2 className="secondary-title">
        Welcome to product management here you can manage products to your store.<br /><br />
        The decision is yours which product you want to add to your store
        you have the option to see which product you have already in the store you can update the details of the chosen product and delete it if you wish to do so.
      </h2>
      {successMessage && <div className="success-message">{successMessage}</div>} {/* Display success message */}
      <div className="layout-container">
        <div className="form-container">
          <ProductForm 
            addProduct={addProduct} 
            editProduct={editProduct} 
            productToEdit={productToEdit} 
            cancelEdit={cancelEdit} 
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
