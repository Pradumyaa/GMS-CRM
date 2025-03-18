import fs from 'fs';
import db from './config/firebase.js';

// Read the MongoDB exported JSON file
const rawData = fs.readFileSync('data.json', 'utf-8');
const documents = JSON.parse(rawData);

async function migrateData() {
  try {
    const collectionRef = db.collection('employees');

    for (const doc of documents) {
      const docId = doc._id ? doc._id.toString() : collectionRef.doc().id; // Convert ObjectId to string
      delete doc._id; // Firestore doesn't support `_id`, so remove it

      await collectionRef.doc(docId).set(doc);
      console.log(`Migrated document: ${docId}`);
    }

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Error migrating data:', error);
  }
}

migrateData();
