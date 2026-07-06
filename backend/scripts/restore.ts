import fs from 'fs';
import path from 'path';
import { BSON } from 'mongodb';
import { connectDB } from '../src/db';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio-admin';
const isRemote = MONGODB_URI.startsWith('mongodb+srv://');
const BACKUP_DIR = path.join(process.cwd(), isRemote ? 'cluster_data_sequence' : 'data_sequence');

async function runRestore() {
  console.log('Starting MongoDB Restore...');
  console.log(`Connection URI: ${MONGODB_URI.replace(/:([^@]+)@/, ':****@')}`); // Hide password in logs
  console.log(`Source Directory: ${BACKUP_DIR}`);

  if (!fs.existsSync(BACKUP_DIR)) {
    console.error(`Error: Backup directory "${BACKUP_DIR}" does not exist.`);
    process.exit(1);
  }

  try {
    const db = await connectDB();

    // Read all JSON files in the backup directory
    const files = fs.readdirSync(BACKUP_DIR)
      .filter(file => /^\d{2}_.+\.json$/.test(file))
      .sort(); // Sort to ensure sequential execution (e.g. 01, 02, etc.)

    if (files.length === 0) {
      console.log('No sequential backup files found to restore.');
      process.exit(0);
    }

    for (const file of files) {
      const filePath = path.join(BACKUP_DIR, file);
      // Extract collection name, e.g. "01_settings.json" -> "settings"
      const match = file.match(/^\d{2}_(.+)\.json$/);
      if (!match) continue;
      const collectionName = match[1];

      console.log(`Restoring collection: "${collectionName}" from ${file}...`);
      
      const fileContent = fs.readFileSync(filePath, 'utf8');
      // Deserialize from EJSON to recover types like ObjectId and Date
      const documents = BSON.EJSON.parse(fileContent) as any[];

      // Clear existing collection data
      await db.collection(collectionName).deleteMany({});
      console.log(`Cleared existing documents in collection "${collectionName}"`);

      if (documents.length > 0) {
        const result = await db.collection(collectionName).insertMany(documents);
        console.log(`Successfully restored ${result.insertedCount} documents to "${collectionName}"`);
      } else {
        console.log(`Collection "${collectionName}" is empty in backup.`);
      }
    }

    console.log('\nRestore completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\nRestore failed:', error);
    process.exit(1);
  }
}

runRestore();
