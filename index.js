const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config(); // Load environment variables

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Create a PostgreSQL connection pool
const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

// Test the database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to database:', err);
  } else {
    console.log('Database connected:', res.rows[0]);
  }
});

const authRoutes = require('./routes/auth');
const movieRoutes = require('./routes/movies'); // Add movie routes
const ratingRoutes = require('./routes/ratings'); // Add rating routes

app.use('/api/auth', authRoutes(pool)); // Pass the pool to authRoutes
app.use('/api/movies', movieRoutes(pool)); // Add movie routes
app.use('/api/ratings', ratingRoutes(pool)); // Add rating routes

app.get('/', (req, res) => {
  res.send('Auth API is running');
});

app.listen(port, () => {
  console.log(`Auth API listening on port ${port}`);
});