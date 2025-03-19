import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, Pressable, Alert } from 'react-native';

const ManageUsers = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    // Here you would typically send the data to your backend
    console.log(`Email: ${email}, New Password: ${password}`);
    Alert.alert('Success', 'Password updated successfully!');
    setEmail('');
    setPassword('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Manage User Passwords</Text>
      <TextInput
        style={styles.input}
        placeholder="User Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="New Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Pressable style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Update Password</Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default ManageUsers;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#D3D3D3',
    height: 50,
    marginBottom: 15,
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#FF5733',
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
// </create_file>
