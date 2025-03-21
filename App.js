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
import StudentDashboard from './Screens/StudentDashboard';
import AdminAnnouncements from './Screens/AdminAnnouncement';
import StudentAnnouncements from './Screens/StudentAnnouncement';
import Teachers from './Screens/Teachers';
import TeachersDashboard from './Screens/TeachersDashboard';
import ViewStudents from './Screens/ViewStudents';


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
        <Stack.Screen name="StudentDashboard" component={StudentDashboard} />
        <Stack.Screen name="AdminAnnouncements" component={AdminAnnouncements} />
        <Stack.Screen name="StudentAnnouncements" component={StudentAnnouncements} />
        <Stack.Screen name="Teachers" component={Teachers} />
        <Stack.Screen name="TeachersDashboard" component={TeachersDashboard} />
        <Stack.Screen name="ViewStudents" component={ViewStudents} />



        <Stack.Screen name="LevelKindergarten" component={LevelScreen} />
<Stack.Screen name="LevelLower Primary" component={LevelScreen} />
<Stack.Screen name="LevelUpper Primary" component={LevelScreen} />
<Stack.Screen name="LevelJHS" component={LevelScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}