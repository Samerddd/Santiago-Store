const express = require('express');
const { pool } = require('../config/database');

const router = express.Router();

// GET /api/categories
router.get('/', async (req, res) => {
  try {
    const [categories] = await pool.execute(
      `SELECT c.*, COUNT(p.id) AS product_count
       FROM categories c
       LEFT JOIN products p ON c.id = p.category_id
       GROUP BY c.id
       ORDER BY c.name`
    );
    res.json({ categories });
  } catch (err) {
    res.status(500).json({ message: 'خطأ في جلب الفئات.' });
  }
});

module.exports = router;
