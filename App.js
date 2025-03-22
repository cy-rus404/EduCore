import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from './Screens/SplashScreen';
import HomeScreen from './Screens/HomeScreen';
import LoginScreen from './Screens/LoginScreen';
import AdminDashboard from './Screens/AdminDashboard';
import StudentCategoriesScreen from './Screens/StudentCategoriesScreen';
import StudentListScreen from './Screens/StudentListScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
        <Stack.Screen name="StudentCategories" component={StudentCategoriesScreen} />
        <Stack.Screen name="StudentList" component={StudentListScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}