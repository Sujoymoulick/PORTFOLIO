import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { connectDB } from './db';
import apiRouter from './routes';
import { monitorMiddleware } from './monitor';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Request Logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Realtime Monitor middleware
app.use(monitorMiddleware);

app.use(express.json({ limit: '10mb' }));

// Simple CORS middleware to avoid extra package requirements
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// API Routes
app.use('/api', apiRouter);

// Serve static assets in production
const distPath = path.join(__dirname, '../../../dist');
app.use(express.static(distPath));

// For any other request, send the index.html (supports client side routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) {
      // In development or if the build folder doesn't exist, we send a simple status
      res.status(200).send('API Server is running. Client build (dist) not found.');
    }
  });
});

// Connect to Database and start server
async function startServer() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Server initialization failed:', error);
    process.exit(1);
  }
}

startServer();
