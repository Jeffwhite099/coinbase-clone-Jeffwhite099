import express from 'express';
import { getDb } from '../config/database.js';

const router = express.Router();

// GET /crypto - Get all cryptocurrencies
router.get('/', async (req, res) => {
  try {
    const db = getDb();
    const coins = await db.all('SELECT * FROM crypto_data ORDER BY id');
    const formatted = coins.map(coin => ({
      name: coin.name,
      symbol: coin.symbol,
      price: coin.price,
      image: coin.logo,
      change24h: coin.change_24h,
      createdAt: coin.updated_at
    }));
    res.json({ success: true, count: formatted.length, data: formatted });
  } catch (error) {
    console.error('Error fetching crypto data:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /crypto/gainers - Get top gainers
router.get('/gainers', async (req, res) => {
  try {
    const db = getDb();
    const coins = await db.all('SELECT * FROM crypto_data ORDER BY change_24h DESC LIMIT 6');
    const formatted = coins.map(coin => ({
      name: coin.name,
      symbol: coin.symbol,
      price: coin.price,
      image: coin.logo,
      change24h: coin.change_24h,
      createdAt: coin.updated_at
    }));
    res.json({ success: true, count: formatted.length, data: formatted });
  } catch (error) {
    console.error('Error fetching top gainers:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /crypto/new - Get new listings
router.get('/new', async (req, res) => {
  try {
    const db = getDb();
    const coins = await db.all('SELECT * FROM crypto_data WHERE category = ? LIMIT 6', ['new']);
    const formatted = coins.map(coin => ({
      name: coin.name,
      symbol: coin.symbol,
      price: coin.price,
      image: coin.logo,
      change24h: coin.change_24h,
      createdAt: coin.updated_at
    }));
    res.json({ success: true, count: formatted.length, data: formatted });
  } catch (error) {
    console.error('Error fetching new coins:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Legacy endpoints for backward compatibility
router.get('/tradable', async (req, res) => {
  try {
    const db = getDb();
    const coins = await db.all('SELECT * FROM crypto_data WHERE category = ? ORDER BY id LIMIT 6', ['tradable']);
    const formatted = coins.map(coin => ({
      name: coin.name,
      symbol: coin.symbol,
      price: coin.price,
      image: coin.logo,
      change24h: coin.change_24h,
      createdAt: coin.updated_at
    }));
    res.json({ success: true, data: formatted });
  } catch (error) {
    console.error('Error fetching tradable coins:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/top-gainers', async (req, res) => {
  return router.handle({ ...req, url: '/gainers', method: 'GET' }, res);
});

router.get('/new-coins', async (req, res) => {
  return router.handle({ ...req, url: '/new', method: 'GET' }, res);
});

router.get('/all', async (req, res) => {
  return router.handle({ ...req, url: '/', method: 'GET' }, res);
});

export default router;
