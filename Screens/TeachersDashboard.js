import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  SafeAreaView,
  Image,
} from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { auth, db } from './firebase'; // Import db for Firestore
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';

// Import local images (adjust paths based on your folder structure)
const viewStudentsImage = require('../assets/images/stud.png');
const gradeStudentsImage = require('../assets/images/grade.png');
const attendanceImage = require('../assets/images/attend.png');
const requestLeaveImage = require('../assets/images/leave.png');

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const TeachersDashboard = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [teacherName, setTeacherName] = useState('Teacher'); // Default fallback

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        console.log('Teacher logged in:', currentUser.email, 'UID:', currentUser.uid);
        if (currentUser.email === 'admin@admin.com') {
          Alert.alert('Access Denied', 'This dashboard is for teachers only.');
          navigation.navigate('LoginScreen');
          return;
        }
        // Fetch teacher's name from Firestore
        fetchTeacherName(currentUser.uid);
      } else {
        console.log('No user found. Redirecting to LoginScreen.');
        navigation.navigate('LoginScreen');
      }
    });
    return () => unsubscribe();
  }, [navigation]);

  const fetchTeacherName = async (uid) => {
    try {
      const q = query(collection(db, 'teachers'), where('uid', '==', uid));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const teacherData = querySnapshot.docs[0].data();
        setTeacherName(teacherData.name || 'Teacher');
      } else {
        console.log('No teacher document found for UID:', uid);
        setTeacherName('Teacher'); // Fallback if no match
      }
    } catch (error) {
      console.error('Error fetching teacher name:', error.message);
      setTeacherName('Teacher'); // Fallback on error
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      Alert.alert('Success', 'Signed out successfully');
      navigation.navigate('LoginScreen');
    } catch (error) {
      Alert.alert('Error', 'Failed to sign out: ' + error.message);
    }
  };

  const dashboardOptions = [
    { title: 'View Students', screen: 'ViewStudents', image: viewStudentsImage },
    { title: 'Grade Students', screen: 'GradeStudents', image: gradeStudentsImage },
    { title: 'Attendance', screen: 'Attendance', image: attendanceImage },
    { title: 'Request Leave', screen: 'RequestLeave', image: requestLeaveImage },
  ];

  const renderOption = ({ title, screen, image }) => (
    <TouchableOpacity
      style={styles.optionButton}
      onPress={() => navigation.navigate(screen)}
    >
      <Image source={image} style={styles.optionImage} resizeMode="contain" />
      <Text style={styles.optionText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <PaperProvider>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.screen}>
          <Text style={styles.title}>Teacher Dashboard</Text>
          {user && (
            <Text style={styles.welcomeText}>Welcome, {teacherName}</Text>
          )}
          <View style={styles.optionsContainer}>
            <View style={styles.row}>
              {renderOption(dashboardOptions[0])}
              {renderOption(dashboardOptions[1])}
            </View>
            <View style={styles.row}>
              {renderOption(dashboardOptions[2])}
              {renderOption(dashboardOptions[3])}
            </View>
          </View>
          <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  screen: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: SCREEN_HEIGHT * 0.03,
    paddingHorizontal: SCREEN_WIDTH * 0.05,
    alignItems: 'center',
  },
  title: {
    fontSize: SCREEN_WIDTH * 0.08,
    fontWeight: 'bold',
    color: '#FF5733',
    textAlign: 'center',
    marginBottom: SCREEN_HEIGHT * 0.02,
  },
  welcomeText: {
    fontSize: SCREEN_WIDTH * 0.045,
    color: '#333',
    marginBottom: SCREEN_HEIGHT * 0.03,
  },
  optionsContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: SCREEN_HEIGHT * 0.03,
  },
  optionButton: {
    width: SCREEN_WIDTH * 0.42,
    height: SCREEN_HEIGHT * 0.2,
    backgroundColor: '#FF5733',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    padding: SCREEN_WIDTH * 0.02,
  },
  optionImage: {
    width: '80%',
    height: SCREEN_HEIGHT * 0.12,
    marginBottom: SCREEN_HEIGHT * 0.01,
  },
  optionText: {
    fontSize: SCREEN_WIDTH * 0.04,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  signOutButton: {
    width: SCREEN_WIDTH * 0.8,
    height: SCREEN_HEIGHT * 0.07,
    backgroundColor: '#ccc',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SCREEN_HEIGHT * 0.03,
  },
  signOutText: {
    fontSize: SCREEN_WIDTH * 0.045,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default TeachersDashboard;