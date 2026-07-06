import fs from 'fs';
import path from 'path';
import { BSON } from 'mongodb';
import { connectDB } from '../src/db';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio-admin';
const isRemote = MONGODB_URI.startsWith('mongodb+srv://');
const BACKUP_DIR = path.join(process.cwd(), isRemote ? 'cluster_data_sequence' : 'data_sequence');

async function runBackup() {
  console.log('Starting MongoDB Backup...');
  console.log(`Connection URI: ${MONGODB_URI.replace(/:([^@]+)@/, ':****@')}`); // Hide password in logs
  console.log(`Backup Directory: ${BACKUP_DIR}`);

  // Ensure backup directory exists
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
    console.log('Created backup directory');
  }

  try {
    const db = await connectDB();

    // Dynamically retrieve all collections from the database
    const collectionsInfo = await db.listCollections().toArray();
    const collections = collectionsInfo
      .map(col => col.name)
      .filter(name => !name.startsWith('system.')); // Exclude system collections

    console.log(`Discovered collections: ${collections.join(', ')}`);

    for (let i = 0; i < collections.length; i++) {
      const collectionName = collections[i];
      const seqNumber = String(i + 1).padStart(2, '0');
      const fileName = `${seqNumber}_${collectionName}.json`;
      const filePath = path.join(BACKUP_DIR, fileName);

      console.log(`Backing up collection: "${collectionName}"...`);
      const documents = await db.collection(collectionName).find({}).toArray();
      
      // Serialize to EJSON to preserve types like ObjectId and Date
      const serializedData = BSON.EJSON.stringify(documents, null, 2);
      fs.writeFileSync(filePath, serializedData, 'utf8');
      
      console.log(`Successfully backed up ${documents.length} documents to ${fileName}`);
    }

    console.log('\nBackup completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\nBackup failed:', error);
    process.exit(1);
  }
}

runBackup();
