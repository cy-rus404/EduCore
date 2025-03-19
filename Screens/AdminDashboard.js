import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Provider as PaperProvider, Button, Text } from 'react-native-paper';
import { signOut } from 'firebase/auth';
import { auth } from './firebase';
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const AdminDashboard = ({ navigation }) => {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.navigate('LoginScreen'); // Navigate back to Login on logout
    } catch (error) {
      console.error('Logout Error:', error);
    }
  };

  return (
    <PaperProvider>
      <View style={styles.screen}>
        <Text style={styles.title}>Admin Dashboard</Text>
        <Text style={styles.subtitle}>Welcome, Admin!</Text>

        <Button
          mode="contained"
          onPress={handleLogout}
          style={styles.button}
          buttonColor="#FF5733"
          contentStyle={styles.buttonContent}
        >
          Logout
        </Button>
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: SCREEN_WIDTH * 0.08,
    fontWeight: 'bold',
    color: '#FF5733',
    marginBottom: SCREEN_HEIGHT * 0.02,
  },
  subtitle: {
    fontSize: SCREEN_WIDTH * 0.05,
    color: '#333',
    marginBottom: SCREEN_HEIGHT * 0.05,
  },
  button: {
    borderRadius: SCREEN_WIDTH * 0.02,
  },
  buttonContent: {
    height: SCREEN_HEIGHT * 0.07,
  },
});

export default AdminDashboard;