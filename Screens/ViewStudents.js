import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Alert,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { auth, db } from './firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const ViewStudents = ({ navigation }) => {
  const [teacherClass, setTeacherClass] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeacherClassAndStudents = async () => {
      if (!auth.currentUser) {
        Alert.alert('Error', 'You must be logged in to view students.');
        navigation.navigate('LoginScreen');
        return;
      }

      try {
        // Step 1: Fetch teacher's assigned class
        const teacherQuery = query(
          collection(db, 'teachers'),
          where('uid', '==', auth.currentUser.uid)
        );
        const teacherSnapshot = await getDocs(teacherQuery);

        if (teacherSnapshot.empty) {
          Alert.alert('Error', 'Teacher profile not found.');
          setLoading(false);
          return;
        }

        const teacherData = teacherSnapshot.docs[0].data();
        const assignedClass = teacherData.assignedClass;

        if (!assignedClass) {
          Alert.alert('Error', 'No class assigned to this teacher.');
          setLoading(false);
          return;
        }

        setTeacherClass(assignedClass);

        // Step 2: Fetch students in the assigned class
        const studentsQuery = query(
          collection(db, `students/levels/${assignedClass}`)
        );
        const studentsSnapshot = await getDocs(studentsQuery);

        const studentsList = studentsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setStudents(studentsList);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching students:', error);
        Alert.alert('Error', 'Failed to load students: ' + error.message);
        setLoading(false);
      }
    };

    fetchTeacherClassAndStudents();
  }, [navigation]);

  const renderStudent = ({ item }) => (
    <View style={styles.studentItem}>
      {item.imageUrl && <Image source={{ uri: item.imageUrl }} style={styles.studentImage} />}
      <View style={styles.studentInfo}>
        <Text style={styles.studentName}>{item.name}</Text>
        <Text style={styles.studentDetail}>Age: {item.age || 'N/A'}</Text>
        {/* Add more student details as needed */}
      </View>
    </View>
  );

  return (
    <PaperProvider>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.screen}>
          <Text style={styles.title}>
            {teacherClass ? `Students in ${teacherClass}` : 'View Students'}
          </Text>
          {loading ? (
            <Text style={styles.loadingText}>Loading students...</Text>
          ) : students.length > 0 ? (
            <FlatList
              data={students}
              renderItem={renderStudent}
              keyExtractor={item => item.id}
              style={styles.studentList}
            />
          ) : (
            <Text style={styles.noStudentsText}>
              No students found in {teacherClass || 'your class'}.
            </Text>
          )}
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
  },
  title: {
    fontSize: SCREEN_WIDTH * 0.08,
    fontWeight: 'bold',
    color: '#FF5733',
    textAlign: 'center',
    marginBottom: SCREEN_HEIGHT * 0.02,
  },
  loadingText: {
    fontSize: SCREEN_WIDTH * 0.045,
    color: '#333',
    textAlign: 'center',
    marginTop: SCREEN_HEIGHT * 0.1,
  },
  noStudentsText: {
    fontSize: SCREEN_WIDTH * 0.045,
    color: '#333',
    textAlign: 'center',
    marginTop: SCREEN_HEIGHT * 0.1,
  },
  studentList: {
    flex: 1,
  },
  studentItem: {
    flexDirection: 'row',
    padding: SCREEN_WIDTH * 0.03,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    marginBottom: SCREEN_HEIGHT * 0.01,
  },
  studentImage: {
    width: SCREEN_WIDTH * 0.15,
    height: SCREEN_WIDTH * 0.15,
    borderRadius: 5,
    marginRight: SCREEN_WIDTH * 0.03,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: SCREEN_WIDTH * 0.045,
    fontWeight: 'bold',
    color: '#333',
  },
  studentDetail: {
    fontSize: SCREEN_WIDTH * 0.04,
    color: '#666',
  },
});

export default ViewStudents;