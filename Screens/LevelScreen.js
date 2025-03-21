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
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Provider as PaperProvider, Button } from 'react-native-paper';
import { db, auth } from './firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail } from 'firebase/auth';
import * as ImagePicker from 'expo-image-picker';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const CLOUD_NAME = 'dvhylo4ih';

const levelNames = {
  'Kindergarten': 'Kindergarten',
  'Lower Primary': 'Lower Primary',
  'Upper Primary': 'Upper Primary',
  'JHS': 'JHS',
};

const levelClasses = {
  'Kindergarten': ['Creche', 'Nursery', 'Kindergarten 1', 'Kindergarten 2'],
  'Lower Primary': ['Class 1', 'Class 2', 'Class 3'],
  'Upper Primary': ['Class 4', 'Class 5', 'Class 6'],
  'JHS': ['JHS 1', 'JHS 2', 'JHS 3'],
};

const LevelScreen = ({ route, navigation }) => {
  const { level } = route.params;
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [classModalVisible, setClassModalVisible] = useState(false);
  const [parentModal, setParentModal] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [age, setAge] = useState('');
  const [dob, setDob] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        console.log('User authenticated in LevelScreen:', currentUser.uid);
        fetchStudents();
      } else {
        console.log('No user is authenticated in LevelScreen. Redirecting to LoginScreen.');
        navigation.navigate('LoginScreen');
      }
    });

    return () => unsubscribe();
  }, [navigation]);

  const fetchStudents = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'students', 'levels', level));
      const studentList = querySnapshot.docs.map(doc => ({ ...doc.data(), docId: doc.id }));
      setStudents(studentList);
      setFilteredStudents(studentList);
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
      formData.append('upload_preset', 'student_upload');
      formData.append('cloud_name', CLOUD_NAME);

      const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (result.secure_url) {
        return result.secure_url;
      } else {
        throw new Error('Cloudinary upload failed: ' + (result.error?.message || 'Unknown error'));
      }
    } catch (error) {
      throw new Error('Image upload to Cloudinary failed: ' + error.message);
    }
  };

  const addStudent = async () => {
    if (!name || !id || !age || !dob || !studentClass || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      let imageUrl = null;
      if (image) {
        imageUrl = await uploadImageToCloudinary(image);
      }

      const studentData = { name, id, age, dob, studentClass, email, uid: user.uid, imageUrl };
      await addDoc(collection(db, 'students', 'levels', level), studentData);

      Alert.alert('Success', 'Student added successfully');
      clearInputs();
      setModalVisible(false);
      fetchStudents();
    } catch (error) {
      console.error('Add student error:', error);
      Alert.alert('Error', error.message);
    }
  };

  const editStudent = async () => {
    if (!name || !id || !age || !dob || !studentClass || !email) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      let imageUrl = selectedStudent.imageUrl;
      if (image) {
        imageUrl = await uploadImageToCloudinary(image);
      }

      const updatedStudentData = { name, id, age, dob, studentClass, email, imageUrl };
      await updateDoc(doc(db, 'students', 'levels', level, selectedStudent.docId), updatedStudentData);

      Alert.alert('Success', 'Student updated successfully');
      clearInputs();
      setEditModalVisible(false);
      setDetailsModalVisible(false);
      fetchStudents();
    } catch (error) {
      console.error('Edit student error:', error);
      Alert.alert('Error', error.message);
    }
  };

  const deleteStudent = async (docId) => {
    try {
      await deleteDoc(doc(db, 'students', 'levels', level, docId));
      Alert.alert('Success', 'Student deleted');
      setDetailsModalVisible(false);
      fetchStudents();
    } catch (error) {
      console.error('Error deleting student:', error);
      Alert.alert('Error', error.message);
    }
  };

  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert('Success', 'Password reset email sent to ' + email);
    } catch (error) {
      console.error('Error sending password reset email:', error);
      Alert.alert('Error', 'Failed to send password reset email: ' + error.message);
    }
  };

  const clearInputs = () => {
    setName('');
    setId('');
    setAge('');
    setDob('');
    setStudentClass('');
    setEmail('');
    setPassword('');
    setImage(null);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredStudents(students);
    } else {
      const lowerQuery = query.toLowerCase();
      const filtered = students.filter(
        (student) =>
          student.name.toLowerCase().includes(lowerQuery) ||
          student.id.toLowerCase().includes(lowerQuery) ||
          student.email.toLowerCase().includes(lowerQuery)
      );
      setFilteredStudents(filtered);
    }
  };

  const openEditModal = (student) => {
    setSelectedStudent(student);
    setName(student.name);
    setId(student.id);
    setAge(student.age);
    setDob(student.dob);
    setStudentClass(student.studentClass || '');
    setEmail(student.email);
    setImage(null);
    setEditModalVisible(true);
  };

  const openClassModal = () => {
    if (modalVisible) {
      setParentModal('add');
      setModalVisible(false);
    } else if (editModalVisible) {
      setParentModal('edit');
      setEditModalVisible(false);
    }
    setClassModalVisible(true);
  };

  const closeClassModal = () => {
    setClassModalVisible(false);
    if (parentModal === 'add') {
      setModalVisible(true);
    } else if (parentModal === 'edit') {
      setEditModalVisible(true);
    }
    setParentModal(null);
  };

  const selectClass = (className) => {
    setStudentClass(className);
    closeClassModal();
  };

  const renderStudent = ({ item }) => (
    <TouchableOpacity
      style={styles.studentItem}
      onPress={() => {
        setSelectedStudent(item);
        setDetailsModalVisible(true);
      }}
    >
      {item.imageUrl && <Image source={{ uri: item.imageUrl }} style={styles.studentImage} />}
      <Text style={styles.studentName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderClassOption = (className) => (
    <TouchableOpacity
      key={className}
      style={styles.classOption}
      onPress={() => selectClass(className)}
    >
      <Text style={styles.classOptionText}>{className}</Text>
    </TouchableOpacity>
  );

  return (
    <PaperProvider>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.screen}>
          <TextInput
            style={styles.searchBar}
            placeholder="Search students by name, ID, or email..."
            value={searchQuery}
            onChangeText={handleSearch}
            autoCapitalize="none"
          />
          <FlatList
            data={filteredStudents}
            renderItem={renderStudent}
            keyExtractor={item => item.docId}
            style={styles.studentList}
          />
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              clearInputs();
              setModalVisible(true);
            }}
          >
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
          {/* Add Student Modal */}
          <Modal visible={modalVisible} animationType="slide" transparent>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Add Student to {levelNames[level]}</Text>
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
                  keyboardType="numeric"
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
                  placeholder="DOB (YYYY-MM-DD)"
                  value={dob}
                  onChangeText={setDob}
                  keyboardType="numbers-and-punctuation"
                />
                <TouchableOpacity
                  style={styles.dropdownButton}
                  onPress={openClassModal}
                >
                  <Text style={styles.dropdownText}>
                    {studentClass || 'Select Class'}
                  </Text>
                </TouchableOpacity>
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
          {/* Edit Student Modal */}
          <Modal visible={editModalVisible} animationType="slide" transparent>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Edit Student in {levelNames[level]}</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Name"
                  value={name}
                  onChangeText={setName}
                />
                <TextInput
                  style={styles.input}
                  placeholder="ID"
                  value={id}
                  onChangeText={setId}
                  keyboardType="numeric"
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
                  placeholder="DOB (YYYY-MM-DD)"
                  value={dob}
                  onChangeText={setDob}
                  keyboardType="numbers-and-punctuation"
                />
                <TouchableOpacity
                  style={styles.dropdownButton}
                  onPress={openClassModal}
                >
                  <Text style={styles.dropdownText}>
                    {studentClass || 'Select Class'}
                  </Text>
                </TouchableOpacity>
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                  <Text style={styles.imagePickerText}>
                    {image ? 'Image Selected' : 'Pick New Student Image'}
                  </Text>
                </TouchableOpacity>
                {image && <Image source={{ uri: image }} style={styles.previewImage} />}
                {selectedStudent?.imageUrl && !image && (
                  <Image source={{ uri: selectedStudent.imageUrl }} style={styles.previewImage} />
                )}
                <Button
                  mode="contained"
                  onPress={editStudent}
                  style={styles.modalButton}
                  buttonColor="#FF5733"
                >
                  Update
                </Button>
                <Button
                  mode="outlined"
                  onPress={() => setEditModalVisible(false)}
                  style={styles.modalButton}
                  textColor="#FF5733"
                >
                  Cancel
                </Button>
              </View>
            </View>
          </Modal>
          {/* Class Selection Modal */}
          <Modal visible={classModalVisible} animationType="fade" transparent>
            <View style={styles.classModalContainer}>
              <View style={styles.classModalContent}>
                <Text style={styles.modalTitle}>Select Class</Text>
                <ScrollView>
                  {levelClasses[level].map(className => renderClassOption(className))}
                </ScrollView>
                <Button
                  mode="outlined"
                  onPress={closeClassModal}
                  style={styles.modalButton}
                  textColor="#FF5733"
                >
                  Cancel
                </Button>
              </View>
            </View>
          </Modal>
          {/* Student Details Modal */}
          <Modal visible={detailsModalVisible} animationType="slide" transparent>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                {selectedStudent && (
                  <>
                    <Text style={styles.modalTitle}>{selectedStudent.name}</Text>
                    {selectedStudent.imageUrl && (
                      <Image source={{ uri: selectedStudent.imageUrl }} style={styles.modalImage} />
                    )}
                    <Text style={styles.detailText}>ID: {selectedStudent.id}</Text>
                    <Text style={styles.detailText}>Age: {selectedStudent.age}</Text>
                    <Text style={styles.detailText}>DOB: {selectedStudent.dob}</Text>
                    <Text style={styles.detailText}>Class: {selectedStudent.studentClass || 'Not set'}</Text>
                    <Text style={styles.detailText}>Email: {selectedStudent.email}</Text>
                    <Button
                      mode="outlined"
                      onPress={() => openEditModal(selectedStudent)}
                      style={styles.smallEditButton}
                      textColor="#FF5733"
                      labelStyle={styles.smallButtonText}
                    >
                      Edit
                    </Button>
                    <Button
                      mode="outlined"
                      onPress={() => resetPassword(selectedStudent.email)}
                      style={styles.smallResetButton}
                      textColor="#FF5733"
                      labelStyle={styles.smallButtonText}
                    >
                      Reset Password
                    </Button>
                    <Button
                      mode="outlined"
                      onPress={() => deleteStudent(selectedStudent.docId)}
                      style={styles.smallDeleteButton}
                      textColor="#FF5733"
                      labelStyle={styles.smallButtonText}
                    >
                      Delete
                    </Button>
                    <Button
                      mode="outlined"
                      onPress={() => setDetailsModalVisible(false)}
                      style={styles.modalButton}
                      textColor="#FF5733"
                    >
                      Close
                    </Button>
                  </>
                )}
              </View>
            </View>
          </Modal>
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
  studentName: {
    fontSize: SCREEN_WIDTH * 0.045,
    fontWeight: 'bold',
  },
  addButton: {
    position: 'absolute',
    bottom: SCREEN_HEIGHT * 0.03,
    right: SCREEN_WIDTH * 0.05,
    width: SCREEN_WIDTH * 0.15,
    height: SCREEN_WIDTH * 0.15,
    borderRadius: SCREEN_WIDTH * 0.075,
    backgroundColor: '#FF5733',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  addButtonText: {
    fontSize: SCREEN_WIDTH * 0.08,
    color: '#fff',
    fontWeight: 'bold',
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
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: SCREEN_WIDTH * 0.06,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: SCREEN_HEIGHT * 0.02,
  },
  modalImage: {
    width: SCREEN_WIDTH * 0.3,
    height: SCREEN_WIDTH * 0.3,
    borderRadius: 5,
    marginBottom: SCREEN_HEIGHT * 0.02,
  },
  detailText: {
    fontSize: SCREEN_WIDTH * 0.04,
    marginBottom: SCREEN_HEIGHT * 0.01,
  },
  smallEditButton: {
    marginVertical: SCREEN_HEIGHT * 0.01,
    borderRadius: SCREEN_WIDTH * 0.02,
    paddingVertical: 2,
    paddingHorizontal: 5,
  },
  smallResetButton: {
    marginVertical: SCREEN_HEIGHT * 0.01,
    borderRadius: SCREEN_WIDTH * 0.02,
    paddingVertical: 2,
    paddingHorizontal: 5,
  },
  smallDeleteButton: {
    marginVertical: SCREEN_HEIGHT * 0.01,
    borderRadius: SCREEN_WIDTH * 0.02,
    paddingVertical: 2,
    paddingHorizontal: 5,
  },
  smallButtonText: {
    fontSize: SCREEN_WIDTH * 0.035,
  },
  input: {
    height: SCREEN_HEIGHT * 0.06,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: SCREEN_HEIGHT * 0.015,
    width: '100%',
  },
  dropdownButton: {
    height: SCREEN_HEIGHT * 0.06,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: SCREEN_HEIGHT * 0.015,
    width: '100%',
    justifyContent: 'center',
  },
  dropdownText: {
    color: '#333',
    fontSize: SCREEN_WIDTH * 0.04,
  },
  classModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  classModalContent: {
    width: SCREEN_WIDTH * 0.7,
    maxHeight: SCREEN_HEIGHT * 0.4,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: SCREEN_WIDTH * 0.05,
    alignItems: 'center',
  },
  classOption: {
    paddingVertical: SCREEN_HEIGHT * 0.02,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    width: '100%',
    alignItems: 'center',
  },
  classOptionText: {
    fontSize: SCREEN_WIDTH * 0.045,
    color: '#333',
  },
  imagePicker: {
    height: SCREEN_HEIGHT * 0.06,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: SCREEN_HEIGHT * 0.015,
    width: '100%',
  },
  imagePickerText: {
    color: '#333',
  },
  previewImage: {
    width: SCREEN_WIDTH * 0.3,
    height: SCREEN_WIDTH * 0.3,
    borderRadius: 5,
    marginBottom: SCREEN_HEIGHT * 0.015,
  },
  modalButton: {
    marginVertical: SCREEN_HEIGHT * 0.01,
    borderRadius: SCREEN_WIDTH * 0.02,
    width: '100%',
  },
});

export default LevelScreen;