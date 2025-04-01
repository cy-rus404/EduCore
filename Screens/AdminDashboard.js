import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

const AdminDashboard = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hi, Welcome to the Admin Dashboard!</Text>
      <Button
        mode="contained"
        onPress={() => navigation.navigate('Login')} // Changed to 'Login' instead of 'Home'
        style={styles.button}
        buttonColor="#FF5733"
      >
        Log Out
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF5733',
  },
  button: {
    marginTop: 20,
  },
});

export default AdminDashboard;