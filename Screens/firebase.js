 import '@react-native-firebase/app'
 import '@react-native-firebase/auth';

 const firebaseConfig = {
   apiKey: "AIzaSyB9B0I1WMzblJFjUhTZxL-ZIB090CtnFLA",
   authDomain: "edu-core-ddedf.firebaseapp.com",
   projectId: "edu-core-ddedf",
   storageBucket: "edu-core-ddedf.firebasestorage.app",
   messagingSenderId: "197968686336",
   appId: "1:197968686336:web:7af441b663bf559b47d7e5",
 };

 // Initialize Firebase only if it hasn't been initialized yet
 if (!firebase.apps.length) {
   firebase.initializeApp(firebaseConfig);
 }

 const db = firebase.firestore();
 const auth = firebase.auth();

 export { db, auth };