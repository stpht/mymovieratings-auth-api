const express = require('express');
const router = express.Router();

module.exports = (pool) => {
  // POST /api/movies (Add a movie)
  router.post('/', async (req, res) => {
    try {
      const { title, release_date, director, genre } = req.body;
      const result = await pool.query(
        'INSERT INTO movies (title, release_date, director, genre) VALUES ($1, $2, $3, $4) RETURNING *',
        [title, release_date, director, genre]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error adding movie' });
    }
  });

  // GET /api/movies (Get all movies)
  router.get('/', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM movies');
      res.json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error getting movies' });
    }
  });

  // GET /api/movies/:id (Get a movie by ID)
  router.get('/:id', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM movies WHERE id = $1', [req.params.id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Movie not found' });
      }
      res.json(result.rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error getting movie' });
    }
  });

  // PUT /api/movies/:id (Update a movie)
  router.put('/:id', async (req, res) => {
    try {
      const { title, release_date, director, genre } = req.body;
      const result = await pool.query(
        'UPDATE movies SET title = $1, release_date = $2, director = $3, genre = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *',
        [title, release_date, director, genre, req.params.id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Movie not found' });
      }
      res.json(result.rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error updating movie' });
    }
  });

  // DELETE /api/movies/:id (Delete a movie)
  router.delete('/:id', async (req, res) => {
    try {
      const result = await pool.query('DELETE FROM movies WHERE id = $1 RETURNING *', [req.params.id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Movie not found' });
      }
      res.json({ message: 'Movie deleted' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error deleting movie' });
    }
  });

  return router;
};