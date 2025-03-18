

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Modal, Image, TextInput, Alert, Button, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LevelScreen = ({ route, navigation }) => {
  const { level } = route.params; // Get the current level
  const [students, setStudents] = useState([]);
  const [allStudents, setAllStudents] = useState([]); // Store all students for saving back to AsyncStorage
  const [newStudent, setNewStudent] = useState({ 
    name: '', 
    id: '', 
    age: '', 
    course: '', 
    image: null, 
    email: '', 
    password: '' 
  });
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const storedStudents = await AsyncStorage.getItem('students');
      if (storedStudents !== null) {
        const parsedStudents = JSON.parse(storedStudents);
        setAllStudents(parsedStudents);
        setStudents(parsedStudents.filter(student => student.level === level));
      }
    } catch (error) {
      console.error('Failed to load students', error);
    }
  };

  const saveStudents = async (levelStudents) => {
    try {
      // Update only the students from this level in the allStudents array
      const updatedAllStudents = allStudents.filter(student => student.level !== level).concat(levelStudents);
      await AsyncStorage.setItem('students', JSON.stringify(updatedAllStudents));
      setAllStudents(updatedAllStudents);
    } catch (error) {
      console.error('Failed to save students', error);
    }
  };

  const addStudent = () => {
    if (!newStudent.name || !newStudent.id || !newStudent.age || !newStudent.course || !newStudent.image || !newStudent.email || !newStudent.password) {
      Alert.alert('Incomplete Information', 'Please fill in all fields');
      return;
    }

    // Check if email already exists
    if (allStudents.some(student => student.email === newStudent.email)) {
      Alert.alert('Email Already Exists', 'Please use a different email address');
      return;
    }

    const student = {
      id: Date.now().toString(),
      name: newStudent.name,
      studentId: newStudent.id,
      age: newStudent.age,
      course: newStudent.course,
      image: newStudent.image,
      email: newStudent.email,
      password: newStudent.password,
      level,
    };

    const updatedStudents = [...students, student];
    setStudents(updatedStudents);
    saveStudents(updatedStudents);

    setAddModalVisible(false);
    setNewStudent({ name: '', id: '', age: '', course: '', image: null, email: '', password: '' });
  };

  const updateStudent = () => {
    if (!editingStudent) return;

    const updatedStudents = students.map(student => 
      student.id === editingStudent.id ? editingStudent : student
    );

    setStudents(updatedStudents);
    saveStudents(updatedStudents);
    setIsEditModalVisible(false);
    setEditingStudent(null);
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissions needed', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      if (isEditModalVisible && editingStudent) {
        setEditingStudent({ ...editingStudent, image: result.assets[0].uri });
      } else {
        setNewStudent({ ...newStudent, image: result.assets[0].uri });
      }
    }
  };

  const deleteStudent = async (studentId) => {
    const updatedStudents = students.filter(student => student.id !== studentId);
    setStudents(updatedStudents);
    saveStudents(updatedStudents);
    setSelectedStudent(null);
  };

  const renderStudentDetails = () => (
    <Modal
      visible={!!selectedStudent}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setSelectedStudent(null)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Image
            source={{ uri: selectedStudent?.image || 'https://via.placeholder.com/150' }}
            style={styles.studentImage}
          />
          <Text style={styles.detailText}>Name: {selectedStudent?.name}</Text>
          <Text style={styles.detailText}>ID: {selectedStudent?.studentId}</Text>
          <Text style={styles.detailText}>Age: {selectedStudent?.age}</Text>
          <Text style={styles.detailText}>Course: {selectedStudent?.course}</Text>
          <Text style={styles.detailText}>Email: {selectedStudent?.email}</Text>
          <Text style={styles.detailText}>Password: {selectedStudent?.password}</Text>

          <View style={styles.buttonContainer}>
            <Button title="Edit" onPress={() => {
              setSelectedStudent(null);
              setEditingStudent(selectedStudent);
              setIsEditModalVisible(true);
            }} />
            <Button title="Close" onPress={() => setSelectedStudent(null)} />
            <Button title="Delete" onPress={() => deleteStudent(selectedStudent.id)} color="red" />
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.studentCard}
      onPress={() => setSelectedStudent(item)}
    >
      <Image
        source={{ uri: item.image }}
        style={styles.studentImage}
      />
      <View style={styles.studentInfo}>
        <Text style={styles.studentName}>{item.name}</Text>
        <Text style={styles.studentDetail}>ID: {item.studentId}</Text>
        <Text style={styles.studentDetail}>Course: {item.course}</Text>
      </View>
    </TouchableOpacity>
  );

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.course.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
          <Text style={styles.levelTitle}>{level} Students</Text>
          
          <TextInput
            style={styles.searchBar}
            placeholder="Search students by name, ID, or course"
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          <FlatList
            data={filteredStudents}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContainer}
          />

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setAddModalVisible(true)}
          >
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>

          {renderStudentDetails()}

          {/* Add Student Modal */}
          <Modal
            visible={isAddModalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setAddModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Add New Student</Text>

                {newStudent.image ? (
                  <Image source={{ uri: newStudent.image }} style={styles.studentImage} />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <Text>No Image Selected</Text>
                  </View>
                )}

                <Button title="Pick an image" onPress={pickImage} />

                <TextInput
                  style={styles.input}
                  placeholder="Enter student name"
                  placeholderTextColor="#888"
                  value={newStudent.name}
                  onChangeText={(text) => setNewStudent({ ...newStudent, name: text })}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter student ID"
                  placeholderTextColor="#888"
                  value={newStudent.id}
                  onChangeText={(text) => setNewStudent({ ...newStudent, id: text })}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter student age"
                  placeholderTextColor="#888"
                  value={newStudent.age}
                  onChangeText={(text) => setNewStudent({ ...newStudent, age: text })}
                  keyboardType="numeric"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter student course"
                  placeholderTextColor="#888"
                  value={newStudent.course}
                  onChangeText={(text) => setNewStudent({ ...newStudent, course: text })}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter student email"
                  placeholderTextColor="#888"
                  value={newStudent.email}
                  onChangeText={(text) => setNewStudent({ ...newStudent, email: text })}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Assign password"
                  placeholderTextColor="#888"
                  value={newStudent.password}
                  onChangeText={(text) => setNewStudent({ ...newStudent, password: text })}
                  secureTextEntry={false} // Set to true if you want to hide the password
                />

                <View style={styles.buttonContainer}>
                  <Button title="Add" onPress={addStudent} />
                  <Button title="Cancel" onPress={() => setAddModalVisible(false)} color="red" />
                </View>
              </View>
            </View>
          </Modal>

          {/* Edit Student Modal */}
          <Modal
            visible={isEditModalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setIsEditModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Edit Student</Text>

                {editingStudent?.image ? (
                  <Image source={{ uri: editingStudent.image }} style={styles.studentImage} />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <Text>No Image Selected</Text>
                  </View>
                )}

                <Button title="Change image" onPress={pickImage} />

                <TextInput
                  style={styles.input}
                  placeholder="Enter student name"
                  placeholderTextColor="#888"
                  value={editingStudent?.name}
                  onChangeText={(text) => setEditingStudent({ ...editingStudent, name: text })}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter student ID"
                  placeholderTextColor="#888"
                  value={editingStudent?.studentId}
                  onChangeText={(text) => setEditingStudent({ ...editingStudent, studentId: text })}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter student age"
                  placeholderTextColor="#888"
                  value={editingStudent?.age}
                  onChangeText={(text) => setEditingStudent({ ...editingStudent, age: text })}
                  keyboardType="numeric"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter student course"
                  placeholderTextColor="#888"
                  value={editingStudent?.course}
                  onChangeText={(text) => setEditingStudent({ ...editingStudent, course: text })}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter student email"
                  placeholderTextColor="#888"
                  value={editingStudent?.email}
                  onChangeText={(text) => setEditingStudent({ ...editingStudent, email: text })}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Assign password"
                  placeholderTextColor="#888"
                  value={editingStudent?.password}
                  onChangeText={(text) => setEditingStudent({ ...editingStudent, password: text })}
                  secureTextEntry={false} // Set to true if you want to hide the password
                />

                <View style={styles.buttonContainer}>
                  <Button title="Update" onPress={updateStudent} />
                  <Button title="Cancel" onPress={() => setIsEditModalVisible(false)} color="red" />
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  levelTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    marginTop: 40,
  },
  listContainer: {
    paddingBottom: 80,
  },
  studentCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  studentImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 15,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  studentDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#FF5733',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
    color: '#000',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  imagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
    backgroundColor: '#e1e1e1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 16,
    marginBottom: 8,
  },
  searchBar: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
});

export default LevelScreen;