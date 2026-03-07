# Santiago Sports Store — Full Stack

متجر رياضي متكامل مع نظام مصادقة، JWT، Google OAuth، لوحة تحكم مسؤول، ولوحة مستخدمين.

## التقنيات
- Frontend: React 18
- Backend: Node.js + Express.js  
- Database: MySQL
- Auth: JWT + bcryptjs + Google OAuth
- Currency: Israeli Shekel (ILS)
- Language: Arabic RTL

## الإعداد السريع

### 1. قاعدة البيانات
```sql
CREATE DATABASE santiago_store CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Backend
```bash
cd backend
npm install
cp .env.example .env
# عدّل .env بإدخال DB_PASSWORD و JWT_SECRET
npm run dev
```

### 3. Frontend
```bash
cd frontend
npm install
npm start
```

## بيانات الدخول (Admin)
- Username: admin
- Password: admin123

## Google OAuth
1. أنشئ مشروعاً في Google Cloud Console
2. فعّل Google Identity API وأنشئ OAuth 2.0 Client ID
3. ضع Client ID في backend/.env و frontend/.env.local

## الأمان
- bcrypt (rounds: 12) لتشفير كلمات المرور
- JWT مع انتهاء صلاحية 7 أيام
- Role-based access control (admin/user)
- Protected routes middleware
- Prepared statements (SQL injection protection)
- CORS محدود بعنوان Frontend

## هيكل المشروع
```
santiago-store/
├── backend/          Express API + MySQL
│   └── src/
│       ├── config/   database + init
│       ├── middleware/ JWT auth
│       └── routes/   auth, products, orders, admin
└── frontend/         React App
    └── src/
        ├── components/ UI, Navbar, Cart, ProductCard
        ├── context/    Auth + Cart context
        ├── pages/      Home, Shop, Product, Login, Register, Checkout, Dashboard, Admin
        └── utils/      api.js
```
