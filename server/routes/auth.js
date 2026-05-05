import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDb } from '../config/database.js';

const router = express.Router();

// Register endpoint (frontend expects /register)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const db = getDb();

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide an email and password' });
    }

    // Check if user already exists
    const existingUser = await db.get('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const result = await db.run(
      'INSERT INTO users (email, password, name) VALUES (?, ?, ?)',
      [email, hashedPassword, name || email.split('@')[0]]
    );

    // Generate token
    const token = jwt.sign(
      { id: result.lastID, email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      token,
      user: { id: result.lastID, name: name || email.split('@')[0], email }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
});

// Login endpoint (frontend expects /login)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const db = getDb();

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide an email and password' });
    }

    // Find user
    const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
});

// Profile endpoint (frontend expects /profile)
router.get('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const db = getDb();
    const user = await db.get(
      'SELECT id, email, name, created_at AS createdAt FROM users WHERE id = ?',
      [decoded.id]
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Not authorized, token failed' });
  }
});

// Legacy endpoints for backward compatibility
router.post('/signup', async (req, res) => {
  req.body.name = req.body.name || req.body.email?.split('@')[0];
  return router.handle({ ...req, url: '/register', method: 'POST' }, res);
});

router.post('/signin', async (req, res) => {
  return router.handle({ ...req, url: '/login', method: 'POST' }, res);
});

router.get('/verify', async (req, res) => {
  return router.handle({ ...req, url: '/profile', method: 'GET' }, res);
});

export default router;
