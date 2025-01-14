// App.js
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, Button } from 'react-native';
import { initializeApp } from '@firebase/app';
import { getAuth, onAuthStateChanged, signOut } from '@firebase/auth';
import SplashScreen from './Screens/SplashScreen';
import HomeScreen from './Screens/HomeScreen';
import LoginScreen from './Screens/LoginScreen';
import AdminDashboard from './Screens/AdminDashboard';

const firebaseConfig = {
  apiKey: "AIzaSyAaqh3l_22E21TyxJcKwqo6QGPHvZgpEu4",
  authDomain: "educore-1f72e.firebaseapp.com",
  projectId: "educore-1f72e",
  storageBucket: "educore-1f72e.firebasestorage.app",
  messagingSenderId: "122206275781",
  appId: "1:122206275781:web:9bf7c9165dbd6ec11208ac",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const Stack = createNativeStackNavigator();

const AuthenticatedScreen = ({ user, handleAuthentication }) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 20 }}>Welcome, {user.email}</Text>
      <Button title="Logout" onPress={handleAuthentication} color="#e74c3c" />
    </View>
  );
};

export default function App() {
  const [user, setUser] = useState(null);

  // Check if the user is authenticated
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, [auth]);

  const handleAuthentication = async () => {
    try {
      console.log('User logged out successfully!');
      await signOut(auth);
    } catch (error) {
      console.error('Error during logout:', error.message);
    }
  };

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Admin" component={AdminDashboard} />

        {user ? (
          <Stack.Screen name="Authenticated">
            {() => (
              <AuthenticatedScreen user={user} handleAuthentication={handleAuthentication} />
            )}
          </Stack.Screen>
        ) : null}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
