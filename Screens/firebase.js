import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCUzPlGBc5N06BA2v5pSO_0teMyAdVFgAU",
  authDomain: "education-d5cc5.firebaseapp.com",
  projectId: "education-d5cc5",
  storageBucket: "education-d5cc5.firebasestorage.app",
  messagingSenderId: "459319681660",
  appId: "1:459319681660:web:98c735ebe17bc64207dff9",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };