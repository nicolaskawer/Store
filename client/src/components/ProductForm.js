import React, { useState, useEffect } from 'react';

const ProductForm = ({ addProduct, productToEdit, editProduct }) => {
  const [productData, setProductData] = useState({
    productName: '',
    productSKU: '',
    productDescription: '',
    productType: 'vegetable',
    marketingDate: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (productToEdit) {
      setProductData(productToEdit); // Set the product data for editing
    } else {
      setProductData({
        productName: '',
        productSKU: '',
        productDescription: '',
        productType: 'vegetable',
        marketingDate: new Date().toISOString().split('T')[0],
      });
    }
  }, [productToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (productToEdit) {
      // Do not send the productNumber in the edit
      const { productNumber, ...updatedProductData } = productData;
      editProduct(updatedProductData);
    } else {
      addProduct(productData); // Adding a new product
    }
    resetForm();
  };

  const resetForm = () => {
    setProductData({
      productName: '',
      productSKU: '',
      productDescription: '',
      productType: 'vegetable',
      marketingDate: new Date().toISOString().split('T')[0],
    });
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
        value={productData.marketingDate}
        onChange={handleChange}
      />
      <button type="submit">{productToEdit ? 'Update Product' : 'Add Product'}</button>
    </form>
  );
};

export default ProductForm;
