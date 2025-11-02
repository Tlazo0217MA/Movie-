import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; 


const firebaseConfig = {
  apiKey: "AIzaSyCOhWPtwcX4Ib6g7qK5xd6-8Qur2qUXmR0",
  authDomain: "movie-4a3a3.firebaseapp.com",
  projectId: "movie-4a3a3",
  storageBucket: "movie-4a3a3.firebasestorage.app",
  messagingSenderId: "39598551563",
  appId: "1:39598551563:web:424d85e432ab0384710d0e",
  measurementId: "G-KHV7231EN2"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); 
export default app;