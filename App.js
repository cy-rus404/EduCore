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
import Students from './Screens/Students';
import LevelScreen from './Screens/LevelScreen';


// Create the Stack navigator
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
        <Stack.Screen name="Students" component={Students} />
        {/* <Stack.Screen name="LevelScreen" component={LevelScreen} /> */}
        <Stack.Screen
          name="Level100"
          component={LevelScreen}
          initialParams={{ level: 100 }}
        />
        <Stack.Screen
          name="Level200"
          component={LevelScreen}
          initialParams={{ level: 200 }}
        />
        <Stack.Screen
          name="Level300"
          component={LevelScreen}
          initialParams={{ level: 300 }}
        />
        <Stack.Screen
          name="Level400"
          component={LevelScreen}
          initialParams={{ level: 400 }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}