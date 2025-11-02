const admin = require('firebase-admin');


const serviceAccount = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  
  
  private_key: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined,

  // Adding other fields that were in your original JSON, though often optional for init
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url: 'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40movie-4a3a3.iam.gserviceaccount.com',
  universe_domain: 'googleapis.com'
};

try {
  // 2. Initialize the Admin SDK using the dynamic serviceAccount object
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