const express = require('express');
const { pool } = require('../config/database');
const { authenticate, adminOnly } = require('../middleware/auth');

const router = express.Router();

// GET /api/admin/users - all users
router.get('/users', authenticate, adminOnly, async (req, res) => {
  try {
    const [users] = await pool.execute(
      `SELECT u.id, u.username, u.email, u.role, u.avatar, u.google_id, u.created_at,
              COUNT(o.id) AS order_count,
              COALESCE(SUM(o.total), 0) AS total_spent
       FROM users u
       LEFT JOIN orders o ON u.id = o.user_id
       GROUP BY u.id
       ORDER BY u.created_at DESC`
    );
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: 'خطأ في جلب المستخدمين.' });
  }
});

// DELETE /api/admin/users/:id
router.delete('/users/:id', authenticate, adminOnly, async (req, res) => {
  try {
    if (req.params.id === req.user.id) {
      return res.status(400).json({ message: 'لا يمكنك حذف حسابك الخاص.' });
    }

    const [user] = await pool.execute('SELECT role FROM users WHERE id = ?', [req.params.id]);
    if (user.length > 0 && user[0].role === 'admin') {
      return res.status(400).json({ message: 'لا يمكن حذف حساب مسؤول آخر.' });
    }

    await pool.execute('DELETE FROM users WHERE id = ?', [req.params.id]);
    res.json({ message: 'تم حذف المستخدم.' });
  } catch (err) {
    res.status(500).json({ message: 'خطأ في حذف المستخدم.' });
  }
});

// GET /api/admin/stats
router.get('/stats', authenticate, adminOnly, async (req, res) => {
  try {
    const [[{ total_users }]] = await pool.execute("SELECT COUNT(*) AS total_users FROM users WHERE role = 'user'");
    const [[{ total_orders }]] = await pool.execute('SELECT COUNT(*) AS total_orders FROM orders');
    const [[{ total_products }]] = await pool.execute('SELECT COUNT(*) AS total_products FROM products');
    const [[{ total_revenue }]] = await pool.execute("SELECT COALESCE(SUM(total), 0) AS total_revenue FROM orders WHERE status != 'cancelled'");
    const [[{ low_stock }]] = await pool.execute('SELECT COUNT(*) AS low_stock FROM products WHERE stock <= 5');

    res.json({ total_users, total_orders, total_products, total_revenue, low_stock });
  } catch (err) {
    res.status(500).json({ message: 'خطأ في جلب الإحصائيات.' });
  }
});

// GET /api/admin/categories
router.get('/categories', authenticate, adminOnly, async (req, res) => {
  try {
    const [categories] = await pool.execute(
      `SELECT c.*, COUNT(p.id) AS product_count
       FROM categories c LEFT JOIN products p ON c.id = p.category_id
       GROUP BY c.id ORDER BY c.name`
    );
    res.json({ categories });
  } catch (err) {
    res.status(500).json({ message: 'خطأ في جلب الفئات.' });
  }
});

module.exports = router;
