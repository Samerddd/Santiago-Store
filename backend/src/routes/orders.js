const express = require('express');
const { pool } = require('../config/database');
const { authenticate, adminOnly } = require('../middleware/auth');

const router = express.Router();

// POST /api/orders - create order (authenticated users)
router.post('/', authenticate, async (req, res) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const { items, shipping, payment_method } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'السلة فارغة.' });
    }

    const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);

    // Create order
    await conn.execute(
      `INSERT INTO orders (id, user_id, status, total, shipping_name, shipping_phone, shipping_address, shipping_city, payment_method)
       VALUES (UUID(), ?, 'processing', ?, ?, ?, ?, ?, ?)`,
      [req.user.id, total, shipping.name, shipping.phone, shipping.address, shipping.city, payment_method || 'cash']
    );

    const [orderRow] = await conn.execute(
      'SELECT id FROM orders WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
      [req.user.id]
    );

    const orderId = orderRow[0].id;

    // Insert items
    for (const item of items) {
      await conn.execute(
        'INSERT INTO order_items (order_id, product_id, product_name, product_price, quantity) VALUES (?, ?, ?, ?, ?)',
        [orderId, item.id || null, item.name, item.price, item.qty]
      );

      // Decrease stock
      if (item.id) {
        await conn.execute(
          'UPDATE products SET stock = GREATEST(0, stock - ?) WHERE id = ?',
          [item.qty, item.id]
        );
      }
    }

    await conn.commit();

    res.status(201).json({
      message: 'تم تأكيد الطلب بنجاح.',
      orderId,
    });
  } catch (err) {
    await conn.rollback();
    console.error('Order error:', err);
    res.status(500).json({ message: 'خطأ في إنشاء الطلب.' });
  } finally {
    conn.release();
  }
});

// GET /api/orders/my - user's own orders
router.get('/my', authenticate, async (req, res) => {
  try {
    const [orders] = await pool.execute(
      `SELECT o.*, GROUP_CONCAT(oi.product_name ORDER BY oi.id SEPARATOR ', ') AS item_names,
              SUM(oi.quantity) AS total_items
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.order_id
       WHERE o.user_id = ?
       GROUP BY o.id
       ORDER BY o.created_at DESC`,
      [req.user.id]
    );

    res.json({ orders });
  } catch (err) {
    res.status(500).json({ message: 'خطأ في جلب الطلبات.' });
  }
});

// GET /api/orders/my/:id - specific order details
router.get('/my/:id', authenticate, async (req, res) => {
  try {
    const [orders] = await pool.execute(
      'SELECT * FROM orders WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (orders.length === 0) return res.status(404).json({ message: 'الطلب غير موجود.' });

    const [items] = await pool.execute(
      'SELECT * FROM order_items WHERE order_id = ?',
      [req.params.id]
    );

    res.json({ order: orders[0], items });
  } catch (err) {
    res.status(500).json({ message: 'خطأ في جلب الطلب.' });
  }
});

// GET /api/orders - admin: all orders
router.get('/', authenticate, adminOnly, async (req, res) => {
  try {
    const [orders] = await pool.execute(
      `SELECT o.*, u.username, u.email,
              GROUP_CONCAT(CONCAT(oi.product_name, ' x', oi.quantity) ORDER BY oi.id SEPARATOR ' | ') AS items_summary
       FROM orders o
       LEFT JOIN users u ON o.user_id = u.id
       LEFT JOIN order_items oi ON o.id = oi.order_id
       GROUP BY o.id
       ORDER BY o.created_at DESC`
    );
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ message: 'خطأ في جلب الطلبات.' });
  }
});

// PUT /api/orders/:id/status - admin: update status
router.put('/:id/status', authenticate, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['processing', 'shipped', 'delivered', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'حالة غير صالحة.' });
    }

    await pool.execute('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ message: 'تم تحديث الحالة.' });
  } catch (err) {
    res.status(500).json({ message: 'خطأ في تحديث الحالة.' });
  }
});

module.exports = router;
