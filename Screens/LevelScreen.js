import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Modal,
  TextInput,
  TouchableOpacity,
  Alert,
  Dimensions,
  Platform,
} from 'react-native';
import { Provider as PaperProvider, Button } from 'react-native-paper';
import { db, auth } from './firebase';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import * as ImagePicker from 'expo-image-picker';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const LevelScreen = ({ route }) => {
  const { level } = route.params;
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]); // For filtered list
  const [searchQuery, setSearchQuery] = useState(''); // For search bar input
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [age, setAge] = useState('');
  const [dob, setDob] = useState('');
  const [course, setCourse] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'students', 'levels', `level${level}`));
      const studentList = querySnapshot.docs.map(doc => ({ ...doc.data(), docId: doc.id }));
      setStudents(studentList);
      setFilteredStudents(studentList); // Initially, filtered list is the same as the full list
    } catch (error) {
      console.error('Error fetching students:', error);
      Alert.alert('Error', 'Failed to fetch students: ' + error.message);
    }
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert('Permission Denied', 'Permission to access media library is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      console.log('Image picked:', result.assets[0].uri);
    }
  };

  const uploadImageToCloudinary = async (imageUri) => {
    try {
      const formData = new FormData();
      if (Platform.OS === 'web') {
        const response = await fetch(imageUri);
        const blob = await response.blob();
        formData.append('file', blob, 'student.jpg');
      } else {
        formData.append('file', {
          uri: imageUri,
          type: 'image/jpeg',
          name: 'student.jpg',
        });
      }
      formData.append('upload_preset', 'student_upload'); // Your Cloudinary upload preset
      formData.append('cloud_name', 'dvhylo4ih'); // Replace with your Cloudinary cloud name

      const response = await fetch('https://api.cloudinary.com/v1_1/dvhylo4ih/image/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      console.log('Cloudinary API Response:', result);
      if (result.secure_url) {
        return result.secure_url;
      } else {
        throw new Error('Cloudinary upload failed: ' + (result.error?.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Image upload error details:', error);
      throw new Error('Image upload to Cloudinary failed: ' + error.message);
    }
  };

  const addStudent = async () => {
    if (!name || !id || !age || !dob || !course || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('User authenticated:', user.uid);

      let imageUrl = null;
      if (image) {
        try {
          imageUrl = await uploadImageToCloudinary(image);
          console.log('Image uploaded to Cloudinary:', imageUrl);
        } catch (uploadError) {
          console.error('Image upload failed:', uploadError);
          Alert.alert('Warning', 'Student added, but image upload failed: ' + uploadError.message);
        }
      }

      const studentData = { name, id, age, dob, course, email, uid: user.uid, imageUrl };
      await addDoc(collection(db, 'students', 'levels', `level${level}`), studentData);

      Alert.alert('Success', 'Student added successfully');
      clearInputs();
      setModalVisible(false);
      fetchStudents();
    } catch (error) {
      console.error('Add student error:', error);
      Alert.alert('Error', error.message);
    }
  };

  const deleteStudent = async (docId) => {
    try {
      await deleteDoc(doc(db, 'students', 'levels', `level${level}`, docId));
      Alert.alert('Success', 'Student deleted');
      fetchStudents();
    } catch (error) {
      console.error('Error deleting student:', error);
      Alert.alert('Error', error.message);
    }
  };

  const clearInputs = () => {
    setName('');
    setId('');
    setAge('');
    setDob('');
    setCourse('');
    setEmail('');
    setPassword('');
    setImage(null);
  };

  // Search function to filter students
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredStudents(students); // Reset to full list if query is empty
    } else {
      const lowerQuery = query.toLowerCase();
      const filtered = students.filter(
        (student) =>
          student.name.toLowerCase().includes(lowerQuery) ||
          student.id.toLowerCase().includes(lowerQuery) ||
          student.course.toLowerCase().includes(lowerQuery) ||
          student.email.toLowerCase().includes(lowerQuery)
      );
      setFilteredStudents(filtered);
    }
  };

  const renderStudent = ({ item }) => (
    <View style={styles.studentItem}>
      {item.imageUrl && <Image source={{ uri: item.imageUrl }} style={styles.studentImage} />}
      <View style={styles.studentDetails}>
        <Text style={styles.studentText}>
          {item.name} (ID: {item.id})
        </Text>
        <Text>Age: {item.age}, DOB: {item.dob}, Course: {item.course}</Text>
        <Text>Email: {item.email}</Text>
        <Button
          mode="outlined"
          onPress={() => deleteStudent(item.docId)}
          style={styles.deleteButton}
          textColor="#FF5733"
        >
          Delete
        </Button>
      </View>
    </View>
  );

  return (
    <PaperProvider>
      <View style={styles.screen}>
        <Text style={styles.title}>Level {level}</Text>
        {/* Search Bar */}
        <TextInput
          style={styles.searchBar}
          placeholder="Search students by name, ID, course, or email..."
          value={searchQuery}
          onChangeText={handleSearch}
          autoCapitalize="none"
        />
        <FlatList
          data={filteredStudents} // Use filtered list
          renderItem={renderStudent}
          keyExtractor={item => item.docId}
          style={styles.studentList}
        />
        <Button
          mode="contained"
          onPress={() => setModalVisible(true)}
          style={styles.addButton}
          buttonColor="#FF5733"
          contentStyle={styles.buttonContent}
        >
          Add Student
        </Button>

        <Modal visible={modalVisible} animationType="slide" transparent>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Add Student to Level {level}</Text>
              <TextInput
                style={styles.input}
                placeholder="Name"
                value={name}
                onChangeText={setName}
                keyboardType="default"
              />
              <TextInput
                style={styles.input}
                placeholder="ID"
                value={id}
                onChangeText={setId}
                keyboardType="default"
              />
              <TextInput
                style={styles.input}
                placeholder="Age"
                value={age}
                onChangeText={setAge}
                keyboardType="numeric"
              />
              <TextInput
                style={styles.input}
                placeholder="Date of Birth (YYYY-MM-DD)"
                value={dob}
                onChangeText={setDob}
                keyboardType="numbers-and-punctuation"
              />
              <TextInput
                style={styles.input}
                placeholder="Course"
                value={course}
                onChangeText={setCourse}
                keyboardType="default"
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                keyboardType="default"
                secureTextEntry
              />
              <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                <Text style={styles.imagePickerText}>
                  {image ? 'Image Selected' : 'Pick Student Image'}
                </Text>
              </TouchableOpacity>
              {image && <Image source={{ uri: image }} style={styles.previewImage} />}
              <Button
                mode="contained"
                onPress={addStudent}
                style={styles.modalButton}
                buttonColor="#FF5733"
              >
                Save
              </Button>
              <Button
                mode="outlined"
                onPress={() => setModalVisible(false)}
                style={styles.modalButton}
                textColor="#FF5733"
              >
                Cancel
              </Button>
            </View>
          </View>
        </Modal>
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: SCREEN_HEIGHT * 0.03,
  },
  title: {
    fontSize: SCREEN_WIDTH * 0.08,
    fontWeight: 'bold',
    color: '#FF5733',
    textAlign: 'center',
    marginBottom: SCREEN_HEIGHT * 0.01,
  },
  searchBar: {
    height: SCREEN_HEIGHT * 0.06,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginHorizontal: SCREEN_WIDTH * 0.05,
    marginBottom: SCREEN_HEIGHT * 0.02,
    backgroundColor: '#f5f5f5',
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
  },
  studentImage: {
    width: SCREEN_WIDTH * 0.15,
    height: SCREEN_WIDTH * 0.15,
    borderRadius: 5,
    marginRight: SCREEN_WIDTH * 0.03,
  },
  studentDetails: {
    flex: 1,
  },
  studentText: {
    fontSize: SCREEN_WIDTH * 0.04,
    fontWeight: 'bold',
  },
  deleteButton: {
    marginTop: SCREEN_HEIGHT * 0.01,
  },
  addButton: {
    margin: SCREEN_WIDTH * 0.05,
    borderRadius: SCREEN_WIDTH * 0.02,
  },
  buttonContent: {
    height: SCREEN_HEIGHT * 0.07,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: SCREEN_WIDTH * 0.9,
    backgroundColor: '#fff',
    padding: SCREEN_WIDTH * 0.05,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: SCREEN_WIDTH * 0.06,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: SCREEN_HEIGHT * 0.02,
  },
  input: {
    height: SCREEN_HEIGHT * 0.06,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: SCREEN_HEIGHT * 0.015,
  },
  imagePicker: {
    height: SCREEN_HEIGHT * 0.06,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: SCREEN_HEIGHT * 0.015,
  },
  imagePickerText: {
    color: '#333',
  },
  previewImage: {
    width: SCREEN_WIDTH * 0.3,
    height: SCREEN_WIDTH * 0.3,
    borderRadius: 5,
    alignSelf: 'center',
    marginBottom: SCREEN_HEIGHT * 0.015,
  },
  modalButton: {
    marginVertical: SCREEN_HEIGHT * 0.01,
    borderRadius: SCREEN_WIDTH * 0.02,
  },
});

export default LevelScreen;