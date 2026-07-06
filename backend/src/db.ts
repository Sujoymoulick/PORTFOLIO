import { MongoClient, Db } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio-admin';
let client: MongoClient;
let db: Db;

export async function connectDB(): Promise<Db> {
  if (db) return db;
  
  try {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('Connected to MongoDB successfully');
    db = client.db('portfolio-admin');
    
    // Create indexes/collections
    await initDb(db);
    
    return db;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
}

async function initDb(database: Db) {
  try {
    // MongoDB creates collections on demand, but we can set up index profiles
    await database.collection('clients').createIndex({ deletedAt: 1 });
    await database.collection('projects').createIndex({ deletedAt: 1 });
    await database.collection('invoices').createIndex({ invoiceNumber: 1 });
    await database.collection('invoices').createIndex({ deletedAt: 1 });
    await database.collection('payments').createIndex({ deletedAt: 1 });
    await database.collection('expenses').createIndex({ deletedAt: 1 });
    await database.collection('workingProjects').createIndex({ deletedAt: 1 });
    await database.collection('contributions').createIndex({ deletedAt: 1 });
    
    // Initialize settings if empty
    const settingsCount = await database.collection('settings').countDocuments();
    if (settingsCount === 0) {
      await database.collection('settings').insertOne({
        companyName: 'My Portfolio',
        logo: '',
        address: '',
        phone: '',
        email: process.env.ADMIN_EMAIL || 'admin@example.com',
        website: '',
        gst: '',
        invoicePrefix: 'INV-',
        invoiceFooter: 'Thank you for your business!',
        currency: 'USD',
        timezone: 'UTC'
      });
    }
  } catch (err) {
    console.error('Error initializing indexes or default data:', err);
  }
}

export function getDb(): Db {
  if (!db) {
    throw new Error('Database not initialized. Call connectDB first.');
  }
  return db;
}
