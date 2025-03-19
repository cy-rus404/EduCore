// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Add this for Authentication

const firebaseConfig = {
  apiKey: "AIzaSyCUzPlGBc5N06BA2v5pSO_0teMyAdVFgAU",
  authDomain: "education-d5cc5.firebaseapp.com",
  projectId: "education-d5cc5",
  storageBucket: "education-d5cc5.firebasestorage.app",
  messagingSenderId: "459319681660",
  appId: "1:459319681660:web:98c735ebe17bc64207dff9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Initialize Authentication

export { auth }; // Export auth for use in other files