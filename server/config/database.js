import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import bcrypt from 'bcryptjs';

let db = null;

export async function initializeDatabase() {
  try {
    db = await open({
      filename: './database.sqlite',
      driver: sqlite3.Database
    });

    // Create users table
    await db.exec(
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    );

    // Create crypto_data table
    await db.exec(
      CREATE TABLE IF NOT EXISTS crypto_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        symbol TEXT NOT NULL,
        price REAL NOT NULL,
        change_24h REAL NOT NULL,
        logo TEXT,
        category TEXT,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    );

    // Insert initial crypto data if not exists
    const existingCrypto = await db.all('SELECT COUNT(*) as count FROM crypto_data');
    if (existingCrypto[0].count === 0) {
      await db.run(
        'INSERT INTO crypto_data (name, symbol, price, change_24h, logo, category) VALUES (?, ?, ?, ?, ?, ?)',
        ['Bitcoin', 'BTC', 722930.60, -1.41, 'bitcoin.png', 'tradable']
      );
      await db.run(
        'INSERT INTO crypto_data (name, symbol, price, change_24h, logo, category) VALUES (?, ?, ?, ?, ?, ?)',
        ['Ethereum', 'ETH', 20877.99, -2.33, 'ethereum.png', 'tradable']
      );
      await db.run(
        'INSERT INTO crypto_data (name, symbol, price, change_24h, logo, category) VALUES (?, ?, ?, ?, ?, ?)',
        ['Tether', 'USDT', 10.77, 0.01, 'tether.png', 'tradable']
      );
      await db.run(
        'INSERT INTO crypto_data (name, symbol, price, change_24h, logo, category) VALUES (?, ?, ?, ?, ?, ?)',
        ['BNB', 'BNB', 6635.44, -1.83, 'bnb.png', 'tradable']
      );
      await db.run(
        'INSERT INTO crypto_data (name, symbol, price, change_24h, logo, category) VALUES (?, ?, ?, ?, ?, ?)',
        ['XRP', 'XRP', 14.52, -1.25, 'xrp.png', 'tradable']
      );
      await db.run(
        'INSERT INTO crypto_data (name, symbol, price, change_24h, logo, category) VALUES (?, ?, ?, ?, ?, ?)',
        ['USDC', 'USDC', 10.77, 0, 'usdc.png', 'tradable']
      );
      await db.run(
        'INSERT INTO crypto_data (name, symbol, price, change_24h, logo, category) VALUES (?, ?, ?, ?, ?, ?)',
        ['Hyperliquid', 'HYPE', 326.41, -1.32, 'hyperliquid.png', 'new']
      );
      await db.run(
        'INSERT INTO crypto_data (name, symbol, price, change_24h, logo, category) VALUES (?, ?, ?, ?, ?, ?)',
        ['Jupiter', 'JUP', 1.78, -6.48, 'jupiter.png', 'new']
      );
    }

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
}

export function getDb() {
  return db;
}
