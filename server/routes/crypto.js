import express from 'express';
import { getDb } from '../config/database.js';

const router = express.Router();

router.get('/tradable', async (req, res) => {
  try {
    const db = getDb();
    const coins = await db.all(
      'SELECT * FROM crypto_data WHERE category = ? ORDER BY id LIMIT 6',
      ['tradable']
    );
    res.json(coins);
  } catch (error) {
    console.error('Error fetching tradable coins:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/top-gainers', async (req, res) => {
  try {
    const db = getDb();
    const coins = await db.all(
      'SELECT * FROM crypto_data WHERE category = ? ORDER BY change_24h DESC LIMIT 6',
      ['new']
    );
    res.json(coins);
  } catch (error) {
    console.error('Error fetching top gainers:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/new-coins', async (req, res) => {
  try {
    const db = getDb();
    const coins = await db.all(
      'SELECT * FROM crypto_data WHERE category = ? ORDER BY id LIMIT 6',
      ['new']
    );
    res.json(coins);
  } catch (error) {
    console.error('Error fetching new coins:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/all', async (req, res) => {
  try {
    const db = getDb();
    const coins = await db.all('SELECT * FROM crypto_data ORDER BY id');
    res.json(coins);
  } catch (error) {
    console.error('Error fetching all crypto data:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
