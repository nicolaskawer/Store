import React, { useState, useEffect } from 'react';
import './ProductForm.css';

const ProductForm = ({ addProduct, productToEdit, editProduct, cancelEdit }) => {
  const getWeekAgoDate = () => {
    const today = new Date();
    const weekAgo = new Date(today.setDate(today.getDate() - 7));
    return weekAgo.toISOString().split('T')[0];
  };

  const [productData, setProductData] = useState({
    productName: '',
    productSKU: '',
    productDescription: '',
    productType: 'vegetable',
    marketingDate: getWeekAgoDate(), // Default to one week before today
  });

  useEffect(() => {
    if (productToEdit) {
      setProductData({
        ...productToEdit,
        marketingDate: productToEdit.marketingDate || getWeekAgoDate(), // Ensure the date is set
      });
    } else {
      resetForm(); // Reset to default form state
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productToEdit]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (productToEdit) {
      const { productNumber, ...updatedProductData } = productData;
      editProduct(updatedProductData);
    } else {
      addProduct(productData); // Add a new product
    }
    resetForm();
  };

  const resetForm = () => {
    setProductData({
      productName: '',
      productSKU: '',
      productDescription: '',
      productType: 'vegetable',
      marketingDate: getWeekAgoDate(), // Reset to default (one week ago)
    });
  };

  const handleCancelEdit = () => {
    resetForm(); // Reset form to default state
    cancelEdit(); // Trigger cancelEdit in App component
  };

  return (
    <form onSubmit={handleSubmit}>
      {productToEdit && (
        <p>Product Number: <strong>{productData.productNumber}</strong></p>
      )}
      <input
        type="text"
        name="productName"
        value={productData.productName}
        onChange={handleChange}
        required
        maxLength={50}
        placeholder="Product Name"
      />
      <input
        type="number"
        name="productSKU"
        value={productData.productSKU}
        onChange={handleChange}
        required
        placeholder="Product SKU"
      />
      <textarea
        name="productDescription"
        value={productData.productDescription}
        onChange={handleChange}
        placeholder="Product Description"
      />
      <select name="productType" value={productData.productType} onChange={handleChange}>
        <option value="vegetable">Vegetable</option>
        <option value="fruit">Fruit</option>
        <option value="field crops">Field Crops</option>
      </select>
      <input
  type="date"
  name="marketingDate"
  value={productData.marketingDate} // Ensure the date is shown
  onChange={handleChange}
  max={new Date().toISOString().split('T')[0]} // Restrict future dates
/>
      <button type="submit">{productToEdit ? 'Update Product' : 'Add Product'}</button>
      {productToEdit && (
        <button type="button" onClick={handleCancelEdit} style={{ marginLeft: '10px' }}>
          Cancel
        </button>
      )}
    </form>
  );
};

export default ProductForm;
