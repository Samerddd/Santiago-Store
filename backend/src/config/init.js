const { pool } = require('./database');
const bcrypt = require('bcryptjs');

async function initDatabase() {
  console.log('Initializing database schema...');

  // Users table
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
      username VARCHAR(50) UNIQUE NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255),
      role ENUM('admin', 'user') DEFAULT 'user',
      google_id VARCHAR(255) UNIQUE,
      avatar VARCHAR(500),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // Categories table
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS categories (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      slug VARCHAR(100) UNIQUE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // Products table
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS products (
      id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
      name VARCHAR(200) NOT NULL,
      description TEXT,
      price DECIMAL(10,2) NOT NULL,
      stock INT DEFAULT 0,
      category_id INT,
      images JSON,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // Orders table
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS orders (
      id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
      user_id VARCHAR(36) NOT NULL,
      status ENUM('processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'processing',
      total DECIMAL(10,2) NOT NULL,
      shipping_name VARCHAR(100),
      shipping_phone VARCHAR(20),
      shipping_address TEXT,
      shipping_city VARCHAR(100),
      payment_method VARCHAR(50) DEFAULT 'cash',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // Order items table
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS order_items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      order_id VARCHAR(36) NOT NULL,
      product_id VARCHAR(36),
      product_name VARCHAR(200) NOT NULL,
      product_price DECIMAL(10,2) NOT NULL,
      quantity INT NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // Seed default categories
  const categories = [
    ['ترنجات', 'tracksuits'],
    ['تيشيرتات أندية', 'club-tshirts'],
    ['تيشيرتات منتخبات', 'national-jerseys'],
    ['أحذية رياضية', 'shoes'],
    ['إكسسوارات رياضية', 'accessories'],
  ];

  for (const [name, slug] of categories) {
    await pool.execute(
      'INSERT IGNORE INTO categories (name, slug) VALUES (?, ?)',
      [name, slug]
    );
  }

  // Seed admin user
  const [admins] = await pool.execute(
    "SELECT id FROM users WHERE username = 'admin'"
  );

  if (admins.length === 0) {
    const hashedPassword = await bcrypt.hash('admin123', 12);
    await pool.execute(
      `INSERT INTO users (id, username, email, password, role) VALUES (UUID(), 'admin', 'admin@santiago.com', ?, 'admin')`,
      [hashedPassword]
    );
    console.log('✓ Admin user created (username: admin, password: admin123)');
  }

  console.log('✓ Database schema ready');
}

module.exports = { initDatabase };
