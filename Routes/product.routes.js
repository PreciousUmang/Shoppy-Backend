import express from 'express'
import Product from '../Model/product.model.js'

const router = express.Router()

// Fetching all the products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find()
    res.status(200).json({ message: 'Products successfully fetched', products })
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error Fetching Products', error: error.message })
  }
})

// Get a Product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ message: 'Product Not found'})
    res.status(200).json(product)
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error fetching product', error: error.message })
  }
})

// Post a Product
router.post('/', async (req, res) => {
  const { name, price, description, stock } = req.body;

  // Validate input
  if (!name || !price || stock === undefined) {
    return res.status(400).json({ message: 'Name, price, and stock are required.'});
  }

  try {
    const newProduct = new Product({ name, price, description, stock });
    await newProduct.save();
    res.status(201).json({ message: 'Product added successfully', newProduct });
  } catch (error) {
    res.status(500).json({ message: 'Error adding product', error: error.message });
  }
});

// Update a Product
router.put('/:id', async (req, res) => {
  const { name, price, description, stock } = req.body

  try {
    const updateProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name, price, description, stock },
      { new: true, runValidators: true }
    )
    if (!updateProduct)
      return res.status(404).json({ message: 'Product not found' })
    res
      .status(200)
      .json({ message: 'Product has been successfuly updated', updateProduct })
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Something Went Wrong!', error: error.message })
  }
})

// Delete a Product
router.delete('/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id)
    if (!deletedProduct)
      return res
        .status(404)
        .json({
          message: 'The product you are trying to delete does not exist'
        })
    res.status(200).json({ message: 'Product deleted successfully', deletedProduct
    })
  } catch (error) {
    res
      .status(500)
      .json({
        message: 'Something went wrong. Please try again later.',
        error: error.message
      })
  }
})

export default router
