const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Placeholder for user data (replace with a database)
const users = [];

router.post('/register', async (req, res) => {
    try {
      const { username, password } = req.body;
  
      // 1. Validate input (basic example)
      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
      }
  
      // 2. Check if username exists
      const existingUser = users.find(user => user.username === username);
      if (existingUser) {
        return res.status(409).json({ message: 'Username already exists' });
      }
  
      // 3. Hash the password
      const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds
  
      // 4. Create the user (replace with database logic)
      const newUser = {
        id: users.length + 1,
        username,
        password: hashedPassword,
      };
      users.push(newUser);
  
      // 5. Generate a JWT
      const token = jwt.sign(
        { userId: newUser.id },
        'your-secret-key', // Replace with a strong, secure secret key
        { expiresIn: '1h' } // Token expiration time
      );
  
      // 6. Send the response
      res.status(201).json({ token, user: { id: newUser.id, username: newUser.username } });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Registration failed' });
    }
  });

  router.post('/login', async (req, res) => {
    try {
      const { username, password } = req.body;
  
      // 1. Validate input (basic example)
      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
      }
  
      // 2. Find the user (replace with database logic)
      const user = users.find(user => user.username === username);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      // 3. Compare passwords
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      // 4. Generate a JWT
      const token = jwt.sign(
        { userId: user.id },
        'your-secret-key', // Replace with your actual secret key
        { expiresIn: '1h' }
      );
  
      // 5. Send the response
      res.json({ token, user: { id: user.id, username: user.username } });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Login failed' });
    }
  });

module.exports = router;