import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  TextInput, 
  FlatList, 
  Text, 
  View, 
  TouchableOpacity, 
  Modal, 
  Image, 
  Button, 
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Student = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [newStudent, setNewStudent] = useState({
    name: '',
    age: '',
    course: '',
    image: null,
    email: '',
    password:''
  });
  const [students, setStudents] = useState([]);

  // Load data from AsyncStorage on app start
  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const storedStudents = await AsyncStorage.getItem('students');
      if (storedStudents !== null) {
        setStudents(JSON.parse(storedStudents));
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

  const pickImage = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissions needed', 'Sorry, we need camera roll permissions to make this work!');
        return;
      }
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

  const addStudent = () => {
    if (!newStudent.name || !newStudent.age || !newStudent.class) {
      Alert.alert('Incomplete Information', 'Please fill in all fields');
      return;
    }

    const student = {
      id: Date.now().toString(),
      ...newStudent
    };

    const updatedStudents = [...students, student];
    setStudents(updatedStudents);
    saveStudents(updatedStudents);

    setAddModalVisible(false);
    setNewStudent({ name: '', age: '', class: '', image: null });
  };

  const deleteStudent = (id) => {
    Alert.alert(
      'Delete Student',
      'Are you sure you want to delete this student?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updatedStudents = students.filter((student) => student.id !== id);
            setStudents(updatedStudents);
            saveStudents(updatedStudents);
          },
        },
      ],
      { cancelable: true }
    );
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
          <Text style={styles.detailText}>Age: {selectedStudent?.age}</Text>
          <Text style={styles.detailText}>Course: {selectedStudent?.class}</Text>

          <View style={styles.buttonContainer}>
            <Button title="Close" onPress={() => setSelectedStudent(null)} />
            <Button
              title="Delete"
              onPress={() => {
                deleteStudent(selectedStudent?.id);
                setSelectedStudent(null);
              }}
              color="red"
            />
          </View>
        </View>
      </View>
    </Modal>
  );

  const filteredData = students.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderAddStudentModal = () => (
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
            <Image
              source={{ uri: newStudent.image }}
              style={styles.studentImage}
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text>No Image Selected</Text>
            </View>
          )}

          <Button title="Pick an image from camera roll" onPress={pickImage} />

          <TextInput
            style={styles.input}
            placeholder="Enter student name"
            placeholderTextColor="#888"
            value={newStudent.name}
            onChangeText={(text) => setNewStudent({ ...newStudent, name: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter student age"
            placeholderTextColor="#888"
            keyboardType="numeric"
            value={newStudent.age}
            onChangeText={(text) => setNewStudent({ ...newStudent, age: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter student course"
            placeholderTextColor="#888"
            value={newStudent.class}
            onChangeText={(text) => setNewStudent({ ...newStudent, class: text })}
          />

          <View style={styles.buttonContainer}>
            <Button title="Add" onPress={addStudent} />
            <Button title="Cancel" onPress={() => setAddModalVisible(false)} color="red" />
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search by name"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.studentItem}
            onPress={() => setSelectedStudent(item)}
          >
            <Image source={{ uri: item.image }} style={styles.studentListImage} />
            <Text style={styles.studentName}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setAddModalVisible(true)}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      {renderStudentDetails()}
      {renderAddStudentModal()}
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  searchBar: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
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
  studentItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#ccc',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  studentListImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  studentName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
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
  formContainer: {
    width: '100%',
    marginTop: 20,
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
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  studentImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
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
  },
});






export default Student;

