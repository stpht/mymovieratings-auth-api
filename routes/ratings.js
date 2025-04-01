const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

module.exports = (pool) => {
  // POST /api/ratings (Add a rating)
  router.post('/', authenticateToken, async (req, res) => {
    try {
      const { user_id, movie_id, rating, comment } = req.body;
      const result = await pool.query(
        'INSERT INTO ratings (user_id, movie_id, rating, comment) VALUES ($1, $2, $3, $4) RETURNING *',
        [user_id, movie_id, rating, comment]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error adding rating' });
    }
  });

  // GET /api/ratings (Get all ratings)
  router.get('/', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM ratings');
      res.json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error getting ratings' });
    }
  });

  // GET /api/ratings/:id (Get a rating by ID)
  router.get('/:id', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM ratings WHERE id = $1', [req.params.id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Rating not found' });
      }
      res.json(result.rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error getting rating' });
    }
  });

  // PUT /api/ratings/:id (Update a rating)
  router.put('/:id', authenticateToken, async (req, res) => {
    try {
      const { user_id, movie_id, rating, comment } = req.body;
      const result = await pool.query(
        'UPDATE ratings SET user_id = $1, movie_id = $2, rating = $3, comment = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *',
        [user_id, movie_id, rating, comment, req.params.id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Rating not found' });
      }
      res.json(result.rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error updating rating' });
    }
  });

  // DELETE /api/ratings/:id (Delete a rating)
  router.delete('/:id', authenticateToken, async (req, res) => {
    try {
      const result = await pool.query('DELETE FROM ratings WHERE id = $1 RETURNING *', [req.params.id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Rating not found' });
      }
      res.json({ message: 'Rating deleted' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error deleting rating' });
    }
  });

  // GET /api/movies/:id/ratings (Get ratings for a movie)
  router.get('/movies/:id/ratings', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM ratings WHERE movie_id = $1', [req.params.id]);
      res.json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error getting ratings for movie' });
    }
  });

  return router;
};