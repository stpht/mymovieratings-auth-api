const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config(); 

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
app.use('/api/auth', authRoutes(pool)); 

app.get('/', (req, res) => {
  res.send('Auth API is running');
});

app.listen(port, () => {
  console.log(`Auth API listening on port ${port}`);
});