
const admin = require('firebase-admin');


const serviceAccount = require('../serviceAccountKey.json'); 

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
    
  });
  
  console.log('Firebase Admin SDK initialized successfully.');

} catch (error) {
  
  if (!/already exists/u.test(error.message)) {
    console.error('Firebase Admin SDK initialization error:', error.stack);
  }
}

const db = admin.firestore();

const auth = admin.auth(); 

module.exports = { db, auth };