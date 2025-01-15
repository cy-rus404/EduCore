import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { getAuth, signInWithEmailAndPassword } from '@firebase/auth';
import { Picker } from '@react-native-picker/picker';
import { initializeApp } from '@firebase/app';

// Firebase config (replace with your own config)
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

const ADMIN_EMAIL = 'admin@admin.com'; // Predefined admin email for authentication

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [role, setRole] = useState('student'); // Default role: student
  const [isLoading, setIsLoading] = useState(false); // Track loading state

  const handleAuthentication = async () => {
    setErrorMessage(''); // Reset error message
    setIsLoading(true); // Show loader when processing authentication

    try {
      // Sign in
      await signInWithEmailAndPassword(auth, email, password);
      console.log('User signed in successfully!');
      
      // Check for role and validate admin credentials
      if (role === 'admin') {
        // Validate that the email matches the predefined admin email
        if (email !== ADMIN_EMAIL) {
          setErrorMessage('This is not the correct admin email.');
          setIsLoading(false); // Hide loader
          return;
        }
        navigation.navigate('AdminDashboard'); // Navigate to Admin dashboard
      } else if (role === 'teacher') {
        navigation.navigate('TeacherDashboard'); // Navigate to Teacher dashboard
      } else if (role === 'student') {
        navigation.navigate('StudentDashboard'); // Navigate to Student dashboard
      } else {
        setErrorMessage('Invalid role selected.');
      }
    } catch (error) {
      console.error('Authentication error:', error.message);
      setErrorMessage('Authentication failed. Please check your credentials.');
    } finally {
      setIsLoading(false); // Hide loader after authentication process
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.authContainer}>
        <Text style={styles.title}>Sign In</Text>

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

        {/* Role selection */}
        <View style={styles.roleContainer}>
          <Text style={styles.roleLabel}>Select Role:</Text>
          <Picker
            selectedValue={role}
            style={styles.picker}
            onValueChange={(itemValue) => setRole(itemValue)}
          >
            <Picker.Item label="Student" value="student" />
            <Picker.Item label="Teacher" value="teacher" />
            <Picker.Item label="Admin" value="admin" />
          </Picker>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Sign In"
            onPress={handleAuthentication}
            color="#3498db"
          />
        </View>

        {/* Loading Spinner */}
        {isLoading && <ActivityIndicator size="large" color="#3498db" style={styles.loader} />}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#87ceeb', // Background color
  },
  authContainer: {
    width: '90%',
    maxWidth: 500,
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 28,
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 16,
    padding: 10,
    borderRadius: 4,
  },
  roleContainer: {
    marginBottom: 20,
  },
  roleLabel: {
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  picker: {
    height: 100,
    width: '100%',
    marginBottom: 50,
  },
  buttonContainer: {
    marginBottom: 16,
  },
  errorText: {
    color: '#e74c3c',
    marginBottom: 16,
    textAlign: 'center',
    fontSize: 16,
  },
  loader: {
    marginTop: 20,
  },
});

export default LoginScreen;
