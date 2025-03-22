import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDe4CON380N1gkT5hkKDIt3vr0hzXIaQgY",
  authDomain: "edu-core-77349.firebaseapp.com",
  projectId: "edu-core-77349",
  storageBucket: "edu-core-77349.firebasestorage.app",
  messagingSenderId: "349182125622",
  appId: "1:349182125622:web:53f1b28a90663101e35a97"
  
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const db = firebase.firestore();
export default firebase;