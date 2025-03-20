import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  Image,
} from 'react-native';
import { Provider as PaperProvider, Button } from 'react-native-paper';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const TeachersDashboard = ({ navigation }) => {
  const [teacherData, setTeacherData] = useState({ name: '', assignedClass: '', imageUrl: null });
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchTeacherData(currentUser.uid);
      } else {
        navigation.navigate('LoginScreen');
      }
    });
    return () => unsubscribe();
  }, [navigation]);

  const fetchTeacherData = async (uid) => {
    try {
      const q = query(collection(db, 'teachers'), where('uid', '==', uid));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const teacherDoc = querySnapshot.docs[0].data();
        setTeacherData({
          name: teacherDoc.name,
          assignedClass: teacherDoc.assignedClass,
          imageUrl: teacherDoc.imageUrl || null,
        });
      } else {
        console.log('Teacher not found');
      }
    } catch (error) {
      console.error('Error fetching teacher data:', error);
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

  return (
    <PaperProvider>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.screen}>
          <Text style={styles.title}>Teacher Dashboard</Text>
          <View style={styles.profileBox}>
            {teacherData.imageUrl ? (
              <Image source={{ uri: teacherData.imageUrl }} style={styles.teacherImage} />
            ) : (
              <View style={styles.placeholderImage} />
            )}
            <View style={styles.teacherInfo}>
              <Text style={styles.teacherName}>{teacherData.name || 'Teacher'}</Text>
              <Text style={styles.teacherClass}>Class: {teacherData.assignedClass || 'N/A'}</Text>
            </View>
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
  title: {
    fontSize: SCREEN_WIDTH * 0.08,
    fontWeight: 'bold',
    color: '#FF5733',
    textAlign: 'center',
    marginBottom: SCREEN_HEIGHT * 0.03,
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
  teacherImage: {
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
  teacherInfo: {
    flexDirection: 'column',
  },
  teacherName: {
    fontSize: SCREEN_WIDTH * 0.06,
    fontWeight: 'bold',
    color: '#FF5733',
  },
  teacherClass: {
    fontSize: SCREEN_WIDTH * 0.04,
    color: '#333',
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

export default TeachersDashboard;