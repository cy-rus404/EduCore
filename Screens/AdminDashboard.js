import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, Card } from 'react-native-paper';
import { auth } from './firebase';
import { signOut } from 'firebase/auth';

// Import dummy images from local storage
import studentImage from '../assets/images/student.png';
import teacherImage from '../assets/images/student.png';
import classImage from '../assets/images/student.png';
import announcementImage from '../assets/images/student.png';
import settingsImage from '../assets/images/student.png';

const AdminDashboard = ({ navigation }) => {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.navigate('Home');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Navigation handlers for the boxes
  const navigateTo = (screen) => {
    navigation.navigate(screen);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>
      <Text style={styles.welcome}>Welcome, Admin!</Text>

      {/* Dashboard Boxes */}
      <View style={styles.boxContainer}>
        {/* First Row: Students and Teachers */}
        <View style={styles.row}>
          <Card style={styles.card} onPress={() => navigateTo('StudentCategories')}>
            <Card.Cover source={studentImage} style={styles.cardImage} resizeMode="cover" />
            <Card.Content style={styles.cardContent}>
              <Text style={styles.cardTitle}>Students</Text>
            </Card.Content>
          </Card>

          <Card style={styles.card} onPress={() => navigateTo('Teachers')}>
            <Card.Cover source={teacherImage} style={styles.cardImage} resizeMode="cover" />
            <Card.Content style={styles.cardContent}>
              <Text style={styles.cardTitle}>Teachers</Text>
            </Card.Content>
          </Card>
        </View>

        {/* Second Row: Classes and Announcements */}
        <View style={styles.row}>
          <Card style={styles.card} onPress={() => navigateTo('Classes')}>
            <Card.Cover source={classImage} style={styles.cardImage} resizeMode="cover" />
            <Card.Content style={styles.cardContent}>
              <Text style={styles.cardTitle}>Classes</Text>
            </Card.Content>
          </Card>

          <Card style={styles.card} onPress={() => navigateTo('Announcements')}>
            <Card.Cover source={announcementImage} style={styles.cardImage} resizeMode="cover" />
            <Card.Content style={styles.cardContent}>
              <Text style={styles.cardTitle}>Announcements</Text>
            </Card.Content>
          </Card>
        </View>

        {/* Third Row: Settings */}
        <View style={styles.singleRow}>
          <Card style={styles.singleCard} onPress={() => navigateTo('Settings')}>
            <Card.Cover source={settingsImage} style={styles.singleCardImage} resizeMode="cover" />
            <Card.Content style={styles.cardContent}>
              <Text style={styles.cardTitle}>Settings</Text>
            </Card.Content>
          </Card>
        </View>
      </View>

      {/* Logout Button */}
      <Button
        mode="contained"
        onPress={handleLogout}
        style={styles.logoutButton}
        buttonColor="#FF5733"
      >
        Logout
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF5733',
    textAlign: 'center',
    marginBottom: 10,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 30,
  },
  boxContainer: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  singleRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  card: {
    width: '48%',
    elevation: 4,
    borderRadius: 8,
    overflow: 'hidden',
  },
  singleCard: {
    width: '100%',
    elevation: 4,
    borderRadius: 8,
    overflow: 'hidden',
  },
  cardImage: {
    height: 120,
  },
  singleCardImage: {
    height: 150,
  },
  cardContent: {
    backgroundColor: '#FF5733',
    paddingVertical: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  logoutButton: {
    padding: 5,
    marginTop: 20,
  },
});

export default AdminDashboard;