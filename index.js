const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth'); // Import auth routes
app.use('/api/auth', authRoutes); // Use auth routes for /api/auth

app.get('/', (req, res) => {
  res.send('Auth API is running');
});

app.listen(port, () => {
  console.log(`Auth API listening on port ${port}`);
});