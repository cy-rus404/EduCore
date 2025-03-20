import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Provider as PaperProvider, Button } from 'react-native-paper';
import { signOut } from 'firebase/auth';
import { auth } from './firebase';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const StudentDashboard = ({ navigation }) => {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.navigate('LoginScreen');
    } catch (error) {
      console.error('Logout Error:', error);
    }
  };

  return (
    <PaperProvider>
      <View style={styles.screen}>
        <Text style={styles.title}>Student Dashboard</Text>
        <Text style={styles.subtitle}>Welcome, Student!</Text>

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
    paddingVertical: SCREEN_HEIGHT * 0.03,
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
    marginBottom: SCREEN_HEIGHT * 0.03,
  },
  button: {
    marginTop: SCREEN_HEIGHT * 0.03,
    borderRadius: SCREEN_WIDTH * 0.02,
  },
  buttonContent: {
    height: SCREEN_HEIGHT * 0.07,
  },
});

export default StudentDashboard;