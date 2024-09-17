import 'reflect-metadata';
import express from 'express';
import dotenv from 'dotenv';
import { getConnection, closeConnection } from './helpers/database';
import paymentRoutes from './routes/paymentRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

process.on('SIGINT', async () => {
  console.log('Closing database connection and shutting down server...');
  await closeConnection();
  process.exit(0);
});

async function startServer() {
  try {
    await getConnection();
    console.log('Connected to PostgreSQL');

    app.use('/api', paymentRoutes);
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Error starting server:', err);
  }
}

startServer();