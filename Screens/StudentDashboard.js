import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  SafeAreaView,
} from 'react-native';
import { Provider as PaperProvider, Button } from 'react-native-paper';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './firebase';
import { collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';

import image1 from '../assets/images/announce.png';
import image2 from '../assets/images/table.png';
import image3 from '../assets/images/grade.png';
import image4 from '../assets/images/set.png';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const StudentDashboard = ({ navigation }) => {
  const [studentData, setStudentData] = useState({ name: '', id: '', imageUrl: null });
  const [user, setUser] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchStudentData(currentUser.uid);
      } else {
        navigation.navigate('LoginScreen');
      }
    });

    const q = query(collection(db, 'announcements'));
    const unsubscribeAnnouncements = onSnapshot(q, (snapshot) => {
      const announcements = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const unread = announcements.filter(ann => !ann.read).length;
      setUnreadCount(unread);
    }, (error) => {
      console.error('Error fetching announcements:', error);
    });

    return () => {
      unsubscribeAuth();
      unsubscribeAnnouncements();
    };
  }, [navigation]);

  const fetchStudentData = async (uid) => {
    try {
      const levels = ['level100', 'level200', 'level300', 'level400'];
      for (const level of levels) {
        const q = query(collection(db, 'students', 'levels', level), where('uid', '==', uid));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const studentDoc = querySnapshot.docs[0].data();
          setStudentData({
            name: studentDoc.name,
            id: studentDoc.id,
            imageUrl: studentDoc.imageUrl || null,
          });
          return;
        }
      }
      console.log('Student not found in any level');
    } catch (error) {
      console.error('Error fetching student data:', error);
    }
  };

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
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.screen}>
          <View style={styles.profileBox}>
            {studentData.imageUrl ? (
              <Image source={{ uri: studentData.imageUrl }} style={styles.studentImage} />
            ) : (
              <View style={styles.placeholderImage} />
            )}
            <View style={styles.studentInfo}>
              <Text style={styles.studentName}>{studentData.name || 'Student'}</Text>
              <Text style={styles.studentId}>ID: {studentData.id || 'N/A'}</Text>
            </View>
          </View>

          {/* Top Row: Announcements and Timetable */}
          <View style={styles.rowContainer}>
            <TouchableOpacity style={styles.box} onPress={() => navigateTo('StudentAnnouncements')}>
              {unreadCount > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadText}>{unreadCount}</Text>
                </View>
              )}
              <Image source={image1} style={styles.boxImage} />
              <Text style={styles.boxText}>Announcements</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.box} onPress={() => navigateTo('Timetable')}>
              <Image source={image2} style={styles.boxImage} />
              <Text style={styles.boxText}>Timetable</Text>
            </TouchableOpacity>
          </View>

          {/* Bottom Row: Grade and Settings */}
          <View style={styles.rowContainer}>
            <TouchableOpacity style={styles.box} onPress={() => navigateTo('Grade')}>
              <Image source={image3} style={styles.boxImage} />
              <Text style={styles.boxText}>Grade</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.box} onPress={() => navigateTo('Settings')}>
              <Image source={image4} style={styles.boxImage} />
              <Text style={styles.boxText}>Settings</Text>
            </TouchableOpacity>
          </View>

          <Button
            mode="outlined"
            onPress={handleLogout}
            style={styles.logoutButton}
            textColor="#FF5733"
            contentStyle={styles.buttonContent}
          >
            Logout
          </Button>
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
    paddingVertical: SCREEN_HEIGHT * 0.03,
    paddingHorizontal: SCREEN_WIDTH * 0.05,
  },
  profileBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: SCREEN_WIDTH * 0.05,
    marginBottom: SCREEN_HEIGHT * 0.03,
    borderWidth: 1,
    borderColor: '#ccc',
    elevation: 3,
    width: SCREEN_WIDTH * 0.9,
    alignSelf: 'center',
  },
  studentImage: {
    width: SCREEN_WIDTH * 0.1,
    height: SCREEN_WIDTH * 0.1,
    borderRadius: SCREEN_WIDTH * 0.05,
    marginRight: SCREEN_WIDTH * 0.03,
  },
  placeholderImage: {
    width: SCREEN_WIDTH * 0.1,
    height: SCREEN_WIDTH * 0.1,
    borderRadius: SCREEN_WIDTH * 0.05,
    backgroundColor: '#ccc',
    marginRight: SCREEN_WIDTH * 0.03,
  },
  studentInfo: {
    flexDirection: 'column',
  },
  studentName: {
    fontSize: SCREEN_WIDTH * 0.06,
    fontWeight: 'bold',
    color: '#FF5733',
  },
  studentId: {
    fontSize: SCREEN_WIDTH * 0.04,
    color: '#333',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SCREEN_HEIGHT * 0.03,
    width: '100%',
  },
  box: {
    width: SCREEN_WIDTH * 0.42,
    height: SCREEN_HEIGHT * 0.18,
    marginHorizontal: SCREEN_WIDTH * 0.02,
    backgroundColor: '#FF5733',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    position: 'relative', // For positioning the badge
  },
  boxImage: {
    width: '70%',
    height: '50%',
    resizeMode: 'contain',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  boxText: {
    fontSize: SCREEN_WIDTH * 0.045,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: SCREEN_HEIGHT * 0.01,
  },
  unreadBadge: {
    position: 'absolute',
    top: -SCREEN_HEIGHT * 0.01, // Slightly above the box
    right: -SCREEN_WIDTH * 0.01, // Slightly to the right
    backgroundColor: 'red',
    borderRadius: SCREEN_WIDTH * 0.03, // Circular badge
    width: SCREEN_WIDTH * 0.06,
    height: SCREEN_WIDTH * 0.06,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  unreadText: {
    color: '#fff',
    fontSize: SCREEN_WIDTH * 0.035,
    fontWeight: 'bold',
  },
  logoutButton: {
    marginTop: 'auto',
    marginBottom: SCREEN_HEIGHT * 0.03,
    borderRadius: SCREEN_WIDTH * 0.02,
    alignSelf: 'center',
    width: SCREEN_WIDTH * 0.5,
    borderColor: '#FF5733',
    backgroundColor: 'transparent',
  },
  buttonContent: {
    height: SCREEN_HEIGHT * 0.07,
  },
});

export default StudentDashboard;