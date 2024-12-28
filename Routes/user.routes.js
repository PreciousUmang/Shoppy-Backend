import express from "express"
import User from "../Model/user.model.js"
import jwt from "jsonwebtoken"

const router = express.Router()

// Register Route 
router.post('/register', async (req, res)=>{
    const {userId, password} = req.body;
    if(!userId || !password) return res.status(400).json({message: 'User ID and Password can not be blank.'})

        try {
            const existingUser = await User.findOne({ userId });
            if (existingUser) {
              return res.status(400).json({ message: 'User already exists.' });
            }
        
            const newUser = new User({ userId, password });
            await newUser.save();
        
            res.status(201).json({ message: 'User registered successfully!' });
          } catch (error) {
            res.status(500).json({ message: 'Error registering user', error: error.message });
          }
        });

// Login Route
router.post('/login', async (req, res) => {
          const { userId, password } = req.body;
        
          if (!userId || !password) {
            return res.status(400).json({ message: 'User ID and Password are required.' });
          }
        
          try {
            const user = await User.findOne({ userId });
            if (!user || user.password !== password) {
              return res.status(401).json({ message: 'Invalid credentials' });
            }
        
            const token = jwt.sign(
              { userId: user.userId },
             "Precious!23",
              { expiresIn: '1h' } 
            );
        
            res.status(200).json({ message: 'Login successful', token });
          } catch (error) {
            res.status(500).json({ message: 'Error logging in', error: error.message });
          }
        });
        
        export default router;