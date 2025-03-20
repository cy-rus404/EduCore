import React from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Image } from 'react-native';
import { Provider as PaperProvider, Button, Text } from 'react-native-paper';
import { signOut } from 'firebase/auth';
import { auth } from './firebase';

import image1 from '../assets/images/student.png';
import image2 from '../assets/images/teacher.jpg';
import image3 from '../assets/images/class.jpg';
import image4 from '../assets/images/announce.jpg';
import image5 from '../assets/images/settings.jpg';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const AdminDashboard = ({ navigation }) => {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.navigate('LoginScreen');
    } catch (error) {
      console.error('Logout Error:', error);
    }
  };

  const navigateTo = (screen) => {
    navigation.navigate(screen);
  };

  return (
    <PaperProvider>
      <View style={styles.screen}>
        <Text style={styles.title}>Admin Dashboard</Text>
        <Text style={styles.subtitle}>Welcome, Admin!</Text>

        <View style={styles.boxContainer}>
          <TouchableOpacity style={styles.box} onPress={() => navigateTo('Students')}>
            <Image source={image1} style={styles.boxImage} />
            <Text style={styles.boxText}>Students</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.box} onPress={() => navigateTo('Teachers')}>
            <Image source={image2} style={styles.boxImage} />
            <Text style={styles.boxText}>Teachers</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.box} onPress={() => navigateTo('Classes')}>
            <Image source={image3} style={styles.boxImage} />
            <Text style={styles.boxText}>Classes</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.box} onPress={() => navigateTo('AdminAnnouncements')}>
            <Image source={image4} style={styles.boxImage} />
            <Text style={styles.boxText}>Announcements</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.box} onPress={() => navigateTo('Settings')}>
            <Image source={image5} style={styles.boxImage} />
            <Text style={styles.boxText}>Settings</Text>
          </TouchableOpacity>
        </View>

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

// Styles remain unchanged
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
  boxContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: SCREEN_HEIGHT * 0.05,
  },
  box: {
    width: SCREEN_WIDTH * 0.4,
    height: SCREEN_HEIGHT * 0.2,
    margin: SCREEN_WIDTH * 0.02,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  boxImage: {
    width: '100%',
    height: '70%',
    resizeMode: 'cover',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  boxText: {
    fontSize: SCREEN_WIDTH * 0.045,
    fontWeight: 'bold',
    color: '#333',
    marginTop: SCREEN_HEIGHT * 0.01,
  },
  button: {
    borderRadius: SCREEN_WIDTH * 0.02,
  },
  buttonContent: {
    height: SCREEN_HEIGHT * 0.07,
  },
});

export default AdminDashboard;