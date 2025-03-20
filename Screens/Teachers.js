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
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, where } from 'firebase/firestore';
import { createUserWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail, fetchSignInMethodsForEmail } from 'firebase/auth';
import * as ImagePicker from 'expo-image-picker';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const CLOUD_NAME = 'dvhylo4ih';

const levelClasses = {
  100: ['Creche', 'Nursery', 'Kindergarten 1', 'Kindergarten 2'],
  200: ['Class 1', 'Class 2', 'Class 3'],
  300: ['Class 4', 'Class 5', 'Class 6'],
  400: ['JHS 1', 'JHS 2', 'JHS 3'],
};

const allClasses = Object.values(levelClasses).flat();

// Simple email validation regex
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const Teachers = ({ navigation }) => {
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [classModalVisible, setClassModalVisible] = useState(false);
  const [parentModal, setParentModal] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [dob, setDob] = useState('');
  const [assignedClass, setAssignedClass] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        console.log('Authenticated user:', currentUser.email, 'UID:', currentUser.uid);
        fetchTeachers();
      } else {
        console.log('No authenticated user found. Redirecting to LoginScreen.');
        navigation.navigate('LoginScreen');
      }
    });
    return () => unsubscribe();
  }, [navigation]);

  const fetchTeachers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'teachers'));
      const teacherList = querySnapshot.docs.map(doc => ({ ...doc.data(), docId: doc.id }));
      setTeachers(teacherList);
      setFilteredTeachers(teacherList);
    } catch (error) {
      console.error('Error fetching teachers:', error.message);
      if (error.code === 'permission-denied') {
        Alert.alert('Permission Error', 'You do not have permission to view teachers.');
      } else {
        Alert.alert('Error', 'Failed to fetch teachers: ' + error.message);
      }
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
        formData.append('file', blob, 'teacher.jpg');
      } else {
        formData.append('file', {
          uri: imageUri,
          type: 'image/jpeg',
          name: 'teacher.jpg',
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

  const addTeacher = async () => {
    if (!name || !age || !dob || !assignedClass || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // Ensure the current user is the admin
    if (!auth.currentUser || auth.currentUser.email !== 'admin@admin.com') {
      Alert.alert('Permission Error', 'Only the admin (admin@admin.com) can add teachers.');
      navigation.navigate('LoginScreen');
      return;
    }

    // Validate email format
    if (!isValidEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address (e.g., teacher@example.com).');
      return;
    }

    try {
      // Check if the email is already in use
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);
      let userUid;

      if (signInMethods.length > 0) {
        // Email already exists, check if it's already a teacher
        const teacherQuery = query(collection(db, 'teachers'), where('email', '==', email));
        const teacherSnapshot = await getDocs(teacherQuery);
        if (!teacherSnapshot.empty) {
          Alert.alert('Error', 'This email is already assigned to a teacher.');
          return;
        }
        Alert.alert(
          'Email Already in Use',
          'This email is already registered. Do you want to assign this existing account as a teacher? (Note: UID cannot be determined client-side.)',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Yes',
              onPress: () => {
                Alert.alert('Error', 'Cannot assign existing account client-side. Use a new email or contact support.');
              },
            },
          ]
        );
        return;
      }

      // Email is not in use, create a new user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      userUid = userCredential.user.uid;

      let imageUrl = null;
      if (image) {
        imageUrl = await uploadImageToCloudinary(image);
      }

      const teacherData = { name, age, dob, assignedClass, email, uid: userUid, imageUrl };
      await addDoc(collection(db, 'teachers'), teacherData);

      Alert.alert('Success', 'Teacher added successfully');
      clearInputs();
      setModalVisible(false);
      fetchTeachers();
    } catch (error) {
      console.error('Add teacher error:', error);
      if (error.code === 'auth/invalid-email') {
        Alert.alert('Error', 'The email address is invalid. Please enter a valid email (e.g., teacher@example.com).');
      } else if (error.code === 'permission-denied') {
        Alert.alert(
          'Permission Error',
          'You do not have sufficient permissions to add a teacher. Ensure you are logged in as admin@admin.com.'
        );
      } else if (error.code === 'auth/email-already-in-use') {
        Alert.alert('Error', 'This email is already in use by another account.');
      } else {
        Alert.alert('Error', error.message);
      }
    }
  };

  const editTeacher = async () => {
    if (!name || !age || !dob || !assignedClass || !email) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      let imageUrl = selectedTeacher.imageUrl;
      if (image) {
        imageUrl = await uploadImageToCloudinary(image);
      }

      const updatedTeacherData = { name, age, dob, assignedClass, email, imageUrl };
      await updateDoc(doc(db, 'teachers', selectedTeacher.docId), updatedTeacherData);

      Alert.alert('Success', 'Teacher updated successfully');
      clearInputs();
      setEditModalVisible(false);
      setDetailsModalVisible(false);
      fetchTeachers();
    } catch (error) {
      console.error('Edit teacher error:', error);
      Alert.alert('Error', error.message);
    }
  };

  const deleteTeacher = async (docId) => {
    try {
      await deleteDoc(doc(db, 'teachers', docId));
      Alert.alert('Success', 'Teacher deleted');
      setDetailsModalVisible(false);
      fetchTeachers();
    } catch (error) {
      console.error('Error deleting teacher:', error);
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
    setAge('');
    setDob('');
    setAssignedClass('');
    setEmail('');
    setPassword('');
    setImage(null);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredTeachers(teachers);
    } else {
      const lowerQuery = query.toLowerCase();
      const filtered = teachers.filter(
        (teacher) =>
          teacher.name.toLowerCase().includes(lowerQuery) ||
          teacher.email.toLowerCase().includes(lowerQuery)
      );
      setFilteredTeachers(filtered);
    }
  };

  const openEditModal = (teacher) => {
    setSelectedTeacher(teacher);
    setName(teacher.name);
    setAge(teacher.age);
    setDob(teacher.dob);
    setAssignedClass(teacher.assignedClass || '');
    setEmail(teacher.email);
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
    setAssignedClass(className);
    closeClassModal();
  };

  const renderTeacher = ({ item }) => (
    <TouchableOpacity
      style={styles.teacherItem}
      onPress={() => {
        setSelectedTeacher(item);
        setDetailsModalVisible(true);
      }}
    >
      {item.imageUrl && <Image source={{ uri: item.imageUrl }} style={styles.teacherImage} />}
      <Text style={styles.teacherName}>{item.name}</Text>
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
          <Text style={styles.title}>Teachers</Text>
          <TextInput
            style={styles.searchBar}
            placeholder="Search teachers by name or email..."
            value={searchQuery}
            onChangeText={handleSearch}
            autoCapitalize="none"
          />
          <FlatList
            data={filteredTeachers}
            renderItem={renderTeacher}
            keyExtractor={item => item.docId}
            style={styles.teacherList}
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
          {/* Add Teacher Modal */}
          <Modal visible={modalVisible} animationType="slide" transparent>
            <View style={styles.modalContainer}>
              <ScrollView contentContainerStyle={styles.modalContent}>
                <Text style={styles.modalTitle}>Add Teacher</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Name"
                  value={name}
                  onChangeText={setName}
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
                <TouchableOpacity style={styles.dropdownButton} onPress={openClassModal}>
                  <Text style={styles.dropdownText}>{assignedClass || 'Select Class'}</Text>
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
                    {image ? 'Image Selected' : 'Pick Teacher Image'}
                  </Text>
                </TouchableOpacity>
                {image && <Image source={{ uri: image }} style={styles.previewImage} />}
                <Button
                  mode="contained"
                  onPress={addTeacher}
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
              </ScrollView>
            </View>
          </Modal>
          {/* Edit Teacher Modal */}
          <Modal visible={editModalVisible} animationType="slide" transparent>
            <View style={styles.modalContainer}>
              <ScrollView contentContainerStyle={styles.modalContent}>
                <Text style={styles.modalTitle}>Edit Teacher</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Name"
                  value={name}
                  onChangeText={setName}
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
                <TouchableOpacity style={styles.dropdownButton} onPress={openClassModal}>
                  <Text style={styles.dropdownText}>{assignedClass || 'Select Class'}</Text>
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
                    {image ? 'Image Selected' : 'Pick New Teacher Image'}
                  </Text>
                </TouchableOpacity>
                {image && <Image source={{ uri: image }} style={styles.previewImage} />}
                {selectedTeacher?.imageUrl && !image && (
                  <Image source={{ uri: selectedTeacher.imageUrl }} style={styles.previewImage} />
                )}
                <Button
                  mode="contained"
                  onPress={editTeacher}
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
              </ScrollView>
            </View>
          </Modal>
          {/* Class Selection Modal */}
          <Modal visible={classModalVisible} animationType="fade" transparent>
            <View style={styles.classModalContainer}>
              <View style={styles.classModalContent}>
                <Text style={styles.modalTitle}>Select Class</Text>
                <ScrollView>
                  {allClasses.map(className => renderClassOption(className))}
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
          {/* Teacher Details Modal */}
          <Modal visible={detailsModalVisible} animationType="slide" transparent>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                {selectedTeacher && (
                  <>
                    <Text style={styles.modalTitle}>{selectedTeacher.name}</Text>
                    {selectedTeacher.imageUrl && (
                      <Image source={{ uri: selectedTeacher.imageUrl }} style={styles.modalImage} />
                    )}
                    <Text style={styles.detailText}>Age: {selectedTeacher.age}</Text>
                    <Text style={styles.detailText}>DOB: {selectedTeacher.dob}</Text>
                    <Text style={styles.detailText}>Class: {selectedTeacher.assignedClass || 'Not set'}</Text>
                    <Text style={styles.detailText}>Email: {selectedTeacher.email}</Text>
                    <Button
                      mode="outlined"
                      onPress={() => openEditModal(selectedTeacher)}
                      style={styles.smallEditButton}
                      textColor="#FF5733"
                      labelStyle={styles.smallButtonText}
                    >
                      Edit
                    </Button>
                    <Button
                      mode="outlined"
                      onPress={() => resetPassword(selectedTeacher.email)}
                      style={styles.smallResetButton}
                      textColor="#FF5733"
                      labelStyle={styles.smallButtonText}
                    >
                      Reset Password
                    </Button>
                    <Button
                      mode="outlined"
                      onPress={() => deleteTeacher(selectedTeacher.docId)}
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
    paddingHorizontal: SCREEN_WIDTH * 0.05,
  },
  title: {
    fontSize: SCREEN_WIDTH * 0.08,
    fontWeight: 'bold',
    color: '#FF5733',
    textAlign: 'center',
    marginBottom: SCREEN_HEIGHT * 0.02,
  },
  searchBar: {
    height: SCREEN_HEIGHT * 0.06,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: SCREEN_HEIGHT * 0.02,
    backgroundColor: '#f5f5f5',
  },
  teacherList: {
    flex: 1,
  },
  teacherItem: {
    flexDirection: 'row',
    padding: SCREEN_WIDTH * 0.03,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    marginBottom: SCREEN_HEIGHT * 0.01,
  },
  teacherImage: {
    width: SCREEN_WIDTH * 0.15,
    height: SCREEN_WIDTH * 0.15,
    borderRadius: 5,
    marginRight: SCREEN_WIDTH * 0.03,
  },
  teacherName: {
    fontSize: SCREEN_WIDTH * 0.045,
    fontWeight: 'bold',
    color: '#333',
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
    color: '#333',
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
    backgroundColor: '#f5f5f5',
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
    backgroundColor: '#f5f5f5',
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
    backgroundColor: '#f5f5f5',
  },
  imagePickerText: {
    color: '#333',
    fontSize: SCREEN_WIDTH * 0.04,
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

export default Teachers;