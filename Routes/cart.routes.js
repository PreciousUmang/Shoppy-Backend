import express from "express"
import Cart from "../Model/cart.model.js";
import Product from "../Model/product.model.js";
import authMiddleware from "../Middleware/auth.js"

const router = express.Router()


router.use(authMiddleware)
//  Add an item to the cart
router.post('/', async (req, res) =>{

    console.log(req.body)
    const {productID, quantity} = req.body;
    if (!productID || quantity === undefined) return res.status(400).json({ message: 'Product ID and quantity are required.' });
    if (!Number.isInteger(quantity) || quantity < 1) {
        return res.status(400).json({ message: 'Quantity must be a positive integer.' });
      }
    try {
        const product = await Product.findById(productID)
        if (quantity > product.stock) {
            return res.status(400).json({ message: `Only ${product.stock} units available in stock.` });
          }
        if(!product) return res.status(404).json({message:'Product Not Found'})

        const newItem = await Cart.create({
            productID,
            quantity
        })
        res.status(201).json({message:'Cart Item Added Successfully', newItem})
    } catch (error) {
    
 }

})

// Fetch cart Items
router.get('/', async (req, res) =>{
    try {
        const cartItems = await Cart.find().populate("productID")
        // if (!cartItems) return res.status(404).json({message:'No items are available in the cart.'})
        if (cartItems.length === 0) {
            return res.status(200).json({ message: 'Your cart is empty.', cartItems });
          }
        res.status(200).json({message: 'Cart Items successfully fetched.', cartItems})
    } catch (error) {
        res.status(500).json({message:'Something Went Wrong!', error : error.message})        
    }
})

// Update quanntity
router.put('/:id', async (req, res) => {
    const { quantity } = req.body;
  
    if (quantity === undefined || quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1.' });
    }
  
    try {
      const cartItem = await Cart.findById(req.params.id);
      if (!cartItem) {
        return res.status(404).json({ message: 'Cart item not found.' });
      }
  
      const product = await Product.findById(cartItem.productID);
      if (!product) {
        return res.status(404).json({ message: 'Associated product not found.' });
      }
  
      if (quantity > product.stock) {
        return res.status(400).json({
          message: `Only ${product.stock} units are available in stock.`,
        });
      }
  
      cartItem.quantity = quantity;
      await cartItem.save();
  
      res.status(200).json({
        message: 'Cart item quantity updated successfully.',
        cartItem,
      });
    } catch (error) {
      console.error('Error updating cart item:', error.message);
      res.status(500).json({
        message: 'Error updating cart item.',
        error: error.message,
      });
    }
  });
  

// Delete an item
router.delete('/:id', async(req, res) =>{
    try {
        const deletedCartItem = await Cart.findByIdAndDelete(req.params.id)
        if (!deletedCartItem) {
            return res.status(404).json({ message: 'Cart item not found.' });
          }
    
          res.status(200).json({ message: 'Cart item removed successfully', deletedCartItem });
        } catch (error) {
          res.status(500).json({ message: 'Error removing cart item', error: error.message });
        }
})




export default router;