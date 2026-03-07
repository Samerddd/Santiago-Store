const express = require('express');
const bcrypt = require('bcryptjs');
const { OAuth2Client } = require('google-auth-library');
const { pool } = require('../config/database');
const { generateToken, authenticate } = require('../middleware/auth');

const router = express.Router();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'جميع الحقول مطلوبة.' });
    }

    if (username.length < 3) {
      return res.status(400).json({ message: 'اسم المستخدم يجب أن يكون 3 أحرف على الأقل.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل.' });
    }

    // Check duplicate
    const [existing] = await pool.execute(
      'SELECT id FROM users WHERE username = ? OR email = ?',
      [username, email]
    );
    if (existing.length > 0) {
      return res.status(409).json({ message: 'اسم المستخدم أو البريد الإلكتروني مستخدم بالفعل.' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await pool.execute(
      'INSERT INTO users (id, username, email, password, role) VALUES (UUID(), ?, ?, ?, ?)',
      [username, email, hashedPassword, 'user']
    );

    const [newUser] = await pool.execute(
      'SELECT id, username, email, role FROM users WHERE username = ?',
      [username]
    );

    const token = generateToken(newUser[0].id);

    res.status(201).json({
      message: 'تم إنشاء الحساب بنجاح.',
      token,
      user: {
        id: newUser[0].id,
        username: newUser[0].username,
        email: newUser[0].email,
        role: newUser[0].role,
      },
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'خطأ في الخادم. حاول مجدداً.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'اسم المستخدم وكلمة المرور مطلوبان.' });
    }

    const [users] = await pool.execute(
      'SELECT * FROM users WHERE username = ? OR email = ?',
      [username, username]
    );

    if (users.length === 0) {
      return res.status(401).json({ message: 'اسم المستخدم أو كلمة المرور غير صحيحة.' });
    }

    const user = users[0];

    if (!user.password) {
      return res.status(401).json({ message: 'هذا الحساب مرتبط بـ Google. يرجى تسجيل الدخول بـ Google.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'اسم المستخدم أو كلمة المرور غير صحيحة.' });
    }

    const token = generateToken(user.id);

    res.json({
      message: 'تم تسجيل الدخول بنجاح.',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'خطأ في الخادم. حاول مجدداً.' });
  }
});

// POST /api/auth/google
router.post('/google', async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ message: 'بيانات Google مفقودة.' });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    // Find or create user
    let [users] = await pool.execute(
      'SELECT * FROM users WHERE google_id = ? OR email = ?',
      [googleId, email]
    );

    let user;

    if (users.length > 0) {
      user = users[0];
      // Update google_id and avatar if needed
      if (!user.google_id) {
        await pool.execute(
          'UPDATE users SET google_id = ?, avatar = ? WHERE id = ?',
          [googleId, picture, user.id]
        );
      }
    } else {
      // Create new user
      const username = name.replace(/\s+/g, '_').toLowerCase() + '_' + Math.floor(Math.random() * 1000);
      await pool.execute(
        'INSERT INTO users (id, username, email, google_id, avatar, role) VALUES (UUID(), ?, ?, ?, ?, ?)',
        [username, email, googleId, picture, 'user']
      );

      [users] = await pool.execute('SELECT * FROM users WHERE google_id = ?', [googleId]);
      user = users[0];
    }

    const token = generateToken(user.id);

    res.json({
      message: 'تم تسجيل الدخول بـ Google بنجاح.',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar || picture,
      },
    });
  } catch (err) {
    console.error('Google auth error:', err);
    res.status(500).json({ message: 'فشل تسجيل الدخول بـ Google.' });
  }
});

// GET /api/auth/me
router.get('/me', authenticate, async (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
