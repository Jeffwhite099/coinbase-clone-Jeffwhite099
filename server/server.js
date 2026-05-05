import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import cryptoRoutes from './routes/crypto.js';
import { initializeDatabase } from './config/database.js';
import swaggerUi from 'swagger-ui-express';
import specs from './swagger.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

// Initialize database
initializeDatabase();

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser requests (Render health checks, curl, etc.)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
}));

// Routes - match frontend expectations (no /api prefix)
app.use('/auth', authRoutes);
app.use('/crypto', cryptoRoutes);

// Health check
/**
 * @openapi
 * /auth/health:
 *   get:
 *     tags:
 *       - Health
 *     summary: Health check endpoint
 *     description: Returns the status of the backend server.
 *     responses:
 *       200:
 *         description: Backend is running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 message:
 *                   type: string
 *                   example: Backend is running
 */
app.get('/auth/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

// Generic health endpoint for platform checks
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Allowed origins: ${allowedOrigins.join(', ')}`);
});
