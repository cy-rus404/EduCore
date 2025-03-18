import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Modal, Image, TextInput, Alert, Button, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const levels = [
  { id: '1', level: 'Level 100' },
  { id: '2', level: 'Level 200' },
  { id: '3', level: 'Level 300' },
  { id: '4', level: 'Level 400' },
];

const LevelScreen = ({ route, navigation }) => {
  const { level } = route.params; // Get the current level
  const [students, setStudents] = useState([]);
  const [newStudent, setNewStudent] = useState({ name: '', id: '', age: '', course: '', image: null });
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const storedStudents = await AsyncStorage.getItem('students');
      if (storedStudents !== null) {
        const parsedStudents = JSON.parse(storedStudents);
        setStudents(parsedStudents.filter(student => student.level === level)); // Filter students by level
      }
    } catch (error) {
      console.error('Failed to load students', error);
    }
  };

  const saveStudents = async (updatedStudents) => {
    try {
      await AsyncStorage.setItem('students', JSON.stringify(updatedStudents));
    } catch (error) {
      console.error('Failed to save students', error);
    }
  };

  const addStudent = () => {
    if (!newStudent.name || !newStudent.id || !newStudent.age || !newStudent.course || !newStudent.image) {
      Alert.alert('Incomplete Information', 'Please fill in all fields');
      return;
    }

    const student = {
      id: Date.now().toString(),
      name: newStudent.name,
      studentId: newStudent.id,
      age: newStudent.age,
      course: newStudent.course,
      image: newStudent.image,
      level,
    };

    const updatedStudents = [...students, student];
    setStudents(updatedStudents);
    saveStudents(updatedStudents);

    setAddModalVisible(false);
    setNewStudent({ name: '', id: '', age: '', course: '', image: null });
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
      setNewStudent({ ...newStudent, image: result.assets[0].uri });
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

          <View style={styles.buttonContainer}>
            <Button title="Close" onPress={() => setSelectedStudent(null)} />
            <Button title="Delete" onPress={() => deleteStudent(selectedStudent.id)} color="red" />
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.levelButton}
      onPress={() => setSelectedStudent(item)}
    >
      <Image
        source={{ uri: item.image }}
        style={styles.studentImage}
      />
      <Text style={styles.levelText}>{item.name}</Text>
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
          <TextInput
            style={styles.searchBar}
            placeholder="Search students"
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

                <View style={styles.buttonContainer}>
                  <Button title="Add" onPress={addStudent} />
                  <Button title="Cancel" onPress={() => setAddModalVisible(false)} color="red" />
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
  },
  levelTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  listContainer: {
    marginBottom: 60,
  },
  levelButton: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  studentImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 15,
  },
  levelText: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#4CAF50',
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
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  imagePlaceholder: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
    backgroundColor: '#e1e1e1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 16,
    marginBottom: 10,
    marginTop: 20,
  },
  searchBar: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 20,
    marginTop: 50,
  },
});

export default LevelScreen;
