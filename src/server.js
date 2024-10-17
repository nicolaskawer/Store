import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Load .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5008;
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://nicolas:passwordmongo@cluster0.r4vkn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Middleware
app.use(cors());
app.use(express.json());
mongoose.set('strictQuery', false);

// MongoDB Connection using Mongoose
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.connection.on('connected', () => {
  console.log('Successfully connected to MongoDB database');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

// Product Schema
const productSchema = new mongoose.Schema({
  productNumber: { type: Number, required: true, unique: true },
  productName: { type: String, required: true, maxlength: 50 },
  productSKU: { type: Number, required: true, min: 0 },
  productDescription: { type: String },
  productType: { type: String, enum: ['vegetable', 'fruit', 'field crops'] },
  marketingDate: { type: Date, default: () => new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
});

// Product Model
const Product = mongoose.model('Products', productSchema);

// Routes

// Welcome route for the API
app.get('/', (req, res) => {
  res.send('Welcome to the Products API');
});

// Create a new product (Add method)
app.post('/products', async (req, res) => {
  try {
    // Get the product data from the request body
    const { productName, productSKU, productDescription, productType, marketingDate } = req.body;

    // Get the latest product number
    const lastProduct = await Product.findOne().sort({ productNumber: -1 });
    const nextProductNumber = lastProduct ? lastProduct.productNumber + 1 : 1;

    // Create a new product object using req.body and the next product number
    const newProduct = new Product({
      productNumber: nextProductNumber,
      productName,
      productSKU,
      productDescription,
      productType,
      marketingDate,
    });

    // Save the new product to the database
    await newProduct.save();

    // Respond with the created product and a 201 status code
    res.status(201).send(newProduct);
  } catch (error) {
    // Handle any errors and respond with a 400 status code
    res.status(400).send(error);
  }
});

// List all products
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching products', error });
  }
});

// Update a product
app.put('/products/:id', async (req, res) => {
  try {
    const { productName, productSKU, productDescription, productType, marketingDate } = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
      productName,
      productSKU,
      productDescription,
      productType,
      marketingDate,
    }, { new: true });

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: 'Error updating product', error });
  }
});

// Delete a product
app.delete('/products/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(204).send(); // No content to send back
  } catch (error) {
    res.status(400).json({ message: 'Error deleting product', error });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
