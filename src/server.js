import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5008;
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://nicolas:passwordmongo@cluster0.r4vkn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

app.use(cors());
app.use(express.json());
mongoose.set('strictQuery', false);

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

const productSchema = new mongoose.Schema({
  productNumber: { type: Number, required: true, unique: true },
  productName: { type: String, required: true, maxlength: 50 },
  productSKU: { type: Number, required: true, min: 0 },
  productDescription: { type: String },
  productType: { type: String, enum: ['vegetable', 'fruit', 'field crops'] },
  marketingDate: { type: Date, default: () => new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
});

const Product = mongoose.model('Products', productSchema);

// Create a new product
app.post('/products', async (req, res) => {
  try {
    const { productName, productSKU, productDescription, productType, marketingDate } = req.body;

    const lastProduct = await Product.findOne().sort({ productNumber: -1 });
    const nextProductNumber = lastProduct ? lastProduct.productNumber + 1 : 1;

    const newProduct = new Product({
      productNumber: nextProductNumber,
      productName,
      productSKU,
      productDescription,
      productType,
      marketingDate,
    });

    await newProduct.save();
    res.status(201).send(newProduct);
  } catch (error) {
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
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: 'Error deleting product', error });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
