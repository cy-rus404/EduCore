// import React, { useState, useEffect } from 'react';
// import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
// import { initializeApp } from '@firebase/app';
// import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from '@firebase/auth';


// const firebaseConfig = {
//     apiKey: "AIzaSyAaqh3l_22E21TyxJcKwqo6QGPHvZgpEu4",
//     authDomain: "educore-1f72e.firebaseapp.com",
//     projectId: "educore-1f72e",
//     storageBucket: "educore-1f72e.firebasestorage.app",
//     messagingSenderId: "122206275781",
//     appId: "1:122206275781:web:9bf7c9165dbd6ec11208ac"
//   };
  
  


// const app = initializeApp(firebaseConfig);

// const AuthScreen = ({ email, setEmail, password, setPassword, isLogin, setIsLogin, handleAuthentication }) => {
//   return (
//     <View style={styles.authContainer}>
//        <Text style={styles.title}>{isLogin ? 'Sign In' : 'Sign Up'}</Text>

//        <TextInput
//         style={styles.input}
//         value={email}
//         onChangeText={setEmail}
//         placeholder="Email"
//         autoCapitalize="none"
//       />
//       <TextInput
//         style={styles.input}
//         value={password}
//         onChangeText={setPassword}
//         placeholder="Password"
//         secureTextEntry
//       />
//       <View style={styles.buttonContainer}>
//         <Button title={isLogin ? 'Sign In' : 'Sign Up'} onPress={handleAuthentication} color="#3498db" />
//       </View>

//       <View style={styles.bottomContainer}>
//         <Text style={styles.toggleText} onPress={() => setIsLogin(!isLogin)}>
//           {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Sign In'}
//         </Text>
//       </View>
//     </View>
//   );
// }


// const AuthenticatedScreen = ({ user, handleAuthentication }) => {
//   return (
//     <View style={styles.authContainer}>
//       <Text style={styles.title}>WELCOME</Text>
//       <Text style={styles.emailText}>{user.email}</Text>
//       <Button title="Logout" onPress={handleAuthentication} color="#e74c3c" />
//     </View>
//   );
// };
// export default App = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [user, setUser] = useState(null); 
//   const [isLogin, setIsLogin] = useState(true);

//   const auth = getAuth(app);
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       setUser(user);
//     });

//     return () => unsubscribe();
//   }, [auth]);

  
//   const handleAuthentication = async () => {
//     try {
//       if (user) {
//         // If user is already authenticated, log out
//         console.log('User logged out successfully!');
//         await signOut(auth);
//       } else {
//         // Sign in or sign up
//         if (isLogin) {
//           // Sign in
//           await signInWithEmailAndPassword(auth, email, password);
//           console.log('User signed in successfully!');
//         } else {
//           // Sign up
//           await createUserWithEmailAndPassword(auth, email, password);
//           console.log('User created successfully!');
//         }
//       }
//     } catch (error) {
//       console.error('Authentication error:', error.message);
//     }
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       {user ? (
//         // Show user's email if user is authenticated
//         <AuthenticatedScreen user={user} handleAuthentication={handleAuthentication} />
//       ) : (
//         // Show sign-in or sign-up form if user is not authenticated
//         <AuthScreen
//           email={email}
//           setEmail={setEmail}
//           password={password}
//           setPassword={setPassword}
//           isLogin={isLogin}
//           setIsLogin={setIsLogin}
//           handleAuthentication={handleAuthentication}
//         />
//       )}
//     </ScrollView>
//   );
// }
// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 16,
//     backgroundColor: '#87ceeb',
//   },
//   authContainer: {
//     width: '80%',
//     maxWidth: 400,
//     backgroundColor: '#fff',
//     padding: 16,
//     borderRadius: 8,
//     elevation: 3,
//   },
//   title: {
//     fontSize: 24,
//     marginBottom: 16,
//     textAlign: 'center',
//   },
//   input: {
//     height: 40,
//     borderColor: '#ddd',
//     borderWidth: 1,
//     marginBottom: 16,
//     padding: 8,
//     borderRadius: 4,
//   },
//   buttonContainer: {
//     marginBottom: 16,
//   },
//   toggleText: {
//     color: '#3498db',
//     textAlign: 'center',
//   },
//   bottomContainer: {
//     marginTop: 20,
//   },
//   emailText: {
//     fontSize: 18,
//     textAlign: 'center',
//     marginBottom: 20,
//   },
// });

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import { initializeApp } from '@firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from '@firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAaqh3l_22E21TyxJcKwqo6QGPHvZgpEu4",
  authDomain: "educore-1f72e.firebaseapp.com",
  projectId: "educore-1f72e",
  storageBucket: "educore-1f72e.firebasestorage.app",
  messagingSenderId: "122206275781",
  appId: "1:122206275781:web:9bf7c9165dbd6ec11208ac",
};

const app = initializeApp(firebaseConfig);

const AuthScreen = ({ email, setEmail, password, setPassword, isLogin, setIsLogin, handleAuthentication, errorMessage }) => {
  return (
    <View style={styles.authContainer}>
      <Text style={styles.title}>{isLogin ? 'Sign In' : 'Sign Up'}</Text>

      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
      />
      <View style={styles.buttonContainer}>
        <Button title={isLogin ? 'Sign In' : 'Sign Up'} onPress={handleAuthentication} color="#3498db" />
      </View>

      <View style={styles.bottomContainer}>
        <Text style={styles.toggleText} onPress={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Sign In'}
        </Text>
      </View>
    </View>
  );
};

const AuthenticatedScreen = ({ user, handleAuthentication }) => {
  return (
    <View style={styles.authContainer}>
      <Text style={styles.title}>WELCOME</Text>
      <Text style={styles.emailText}>{user.email}</Text>
      <Button title="Logout" onPress={handleAuthentication} color="#e74c3c" />
    </View>
  );
};

export default App = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, [auth]);

  const handleAuthentication = async () => {
    setErrorMessage(''); // Reset error message
    try {
      if (user) {
        // If user is already authenticated, log out
        console.log('User logged out successfully!');
        await signOut(auth);
      } else {
        // Sign in or sign up
        if (isLogin) {
          // Sign in
          await signInWithEmailAndPassword(auth, email, password);
          console.log('User signed in successfully!');
        } else {
          // Sign up
          await createUserWithEmailAndPassword(auth, email, password);
          console.log('User created successfully!');
        }
      }
    } catch (error) {
      console.error('Authentication error:', error.message);
      setErrorMessage(
        error.message.includes('wrong-password')
          ? 'Incorrect password. Please try again.'
          : 'Authentication failed. Please check your credentials.'
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {user ? (
        // Show user's email if user is authenticated
        <AuthenticatedScreen user={user} handleAuthentication={handleAuthentication} />
      ) : (
        // Show sign-in or sign-up form if user is not authenticated
        <AuthScreen
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          isLogin={isLogin}
          setIsLogin={setIsLogin}
          handleAuthentication={handleAuthentication}
          errorMessage={errorMessage}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#87ceeb',
  },
  authContainer: {
    width: '90%', // Adjusted width for larger box
    maxWidth: 500, // Set a maximum width
    backgroundColor: '#fff',
    padding: 24, // Increased padding
    borderRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 28, // Larger font size
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    height: 50, // Increased height for input fields
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 16,
    padding: 10, // Increased padding
    borderRadius: 4,
  },
  buttonContainer: {
    marginBottom: 16,
  },
  toggleText: {
    color: '#3498db',
    textAlign: 'center',
    marginTop: 16,
    fontSize: 16,
  },
  bottomContainer: {
    marginTop: 20,
  },
  emailText: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 20,
  },
  errorText: {
    color: '#e74c3c', // Red color for errors
    marginBottom: 16,
    textAlign: 'center',
    fontSize: 16,
  },
});
