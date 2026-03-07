const express = require('express');
const { pool } = require('../config/database');
const { authenticate, adminOnly } = require('../middleware/auth');

const router = express.Router();

// GET /api/products - public
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = `
      SELECT p.*, c.name AS category_name, c.slug AS category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (category) {
      query += ' AND c.slug = ?';
      params.push(category);
    }
    if (search) {
      query += ' AND (p.name LIKE ? OR p.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY p.created_at DESC';

    const [products] = await pool.execute(query, params);

    // Parse images JSON
    const result = products.map(p => ({
      ...p,
      images: p.images ? JSON.parse(p.images) : [],
    }));

    res.json({ products: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'خطأ في جلب المنتجات.' });
  }
});

// GET /api/products/:id - public
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT p.*, c.name AS category_name, c.slug AS category_slug
       FROM products p LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.id = ?`,
      [req.params.id]
    );

    if (rows.length === 0) return res.status(404).json({ message: 'المنتج غير موجود.' });

    const product = { ...rows[0], images: rows[0].images ? JSON.parse(rows[0].images) : [] };
    res.json({ product });
  } catch (err) {
    res.status(500).json({ message: 'خطأ في جلب المنتج.' });
  }
});

// POST /api/products - admin only
router.post('/', authenticate, adminOnly, async (req, res) => {
  try {
    const { name, description, price, stock, category_id, images } = req.body;

    if (!name || !price) {
      return res.status(400).json({ message: 'الاسم والسعر مطلوبان.' });
    }

    await pool.execute(
      'INSERT INTO products (id, name, description, price, stock, category_id, images) VALUES (UUID(), ?, ?, ?, ?, ?, ?)',
      [name, description || '', price, stock || 0, category_id || null, JSON.stringify(images || [])]
    );

    const [newProduct] = await pool.execute(
      'SELECT p.*, c.name AS category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id ORDER BY p.created_at DESC LIMIT 1'
    );

    res.status(201).json({
      message: 'تم إضافة المنتج بنجاح.',
      product: { ...newProduct[0], images: JSON.parse(newProduct[0].images || '[]') },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'خطأ في إضافة المنتج.' });
  }
});

// PUT /api/products/:id - admin only
router.put('/:id', authenticate, adminOnly, async (req, res) => {
  try {
    const { name, description, price, stock, category_id, images } = req.body;

    await pool.execute(
      'UPDATE products SET name=?, description=?, price=?, stock=?, category_id=?, images=? WHERE id=?',
      [name, description || '', price, stock || 0, category_id || null, JSON.stringify(images || []), req.params.id]
    );

    res.json({ message: 'تم تحديث المنتج بنجاح.' });
  } catch (err) {
    res.status(500).json({ message: 'خطأ في تحديث المنتج.' });
  }
});

// DELETE /api/products/:id - admin only
router.delete('/:id', authenticate, adminOnly, async (req, res) => {
  try {
    await pool.execute('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.json({ message: 'تم حذف المنتج.' });
  } catch (err) {
    res.status(500).json({ message: 'خطأ في حذف المنتج.' });
  }
});

module.exports = router;
