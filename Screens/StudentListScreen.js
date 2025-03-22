import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Modal, TouchableOpacity, SafeAreaView } from 'react-native';
import { Card, TextInput, Button } from 'react-native-paper';
import { auth, db } from './firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc, onSnapshot } from 'firebase/firestore';
import { launchImageLibrary } from 'react-native-image-picker'; // Updated import
import axios from 'axios';

const StudentListScreen = ({ route }) => {
  const { category } = route.params;
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [students, setStudents] = useState([]);
  const [newStudent, setNewStudent] = useState({
    name: '',
    id: '',
    age: '',
    dob: '',
    image: '',
    email: '',
    password: ''
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, `${category}_students`), (snapshot) => {
      const studentList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setStudents(studentList);
    });
    return () => unsubscribe();
  }, [category]);

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const uploadImageToCloudinary = async () => {
    if (!imageFile) return null;

    const data = new FormData();
    data.append('file', {
      uri: imageFile.uri,
      type: imageFile.type,
      name: imageFile.fileName || 'student_image.jpg',
    });
    data.append('upload_preset', 'unsigned_upload');
    data.append('cloud_name', 'dvhylo4ih');

    try {
      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/dvhylo4ih/image/upload',
        data,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      return response.data.secure_url;
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      return null;
    }
  };

  const pickImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (!response.didCancel && !response.errorCode) {
        setImageFile(response.assets[0]);
      }
    });
  };

  const handleAddStudent = async () => {
    try {
      const imageUrl = await uploadImageToCloudinary();
      const userCredential = await createUserWithEmailAndPassword(auth, newStudent.email, newStudent.password);
      const studentData = {
        name: newStudent.name,
        id: newStudent.id,
        age: newStudent.age,
        dob: newStudent.dob,
        image: imageUrl || '',
        email: newStudent.email,
        uid: userCredential.user.uid,
      };
      await addDoc(collection(db, `${category}_students`), studentData);

      setModalVisible(false);
      setNewStudent({ name: '', id: '', age: '', dob: '', image: '', email: '', password: '' });
      setImageFile(null);
    } catch (error) {
      console.error('Error adding student:', error);
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        <TextInput
          label={`Search ${category} Students`}
          value={searchQuery}
          onChangeText={setSearchQuery}
          mode="outlined"
          style={styles.searchBar}
        />

        <ScrollView>
          <Text style={styles.title}>{category} Students</Text>
          <View style={styles.grid}>
            {filteredStudents.map((student) => (
              <Card key={student.id} style={styles.card}>
                <Card.Cover
                  source={student.image ? { uri: student.image } : require('../assets/images/student.png')}
                  style={styles.cardImage}
                  resizeMode="cover"
                />
                <Card.Content style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{student.name}</Text>
                  <Text style={styles.cardSubtitle}>ID: {student.id}</Text>
                </Card.Content>
              </Card>
            ))}
          </View>
        </ScrollView>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>

        <Modal visible={modalVisible} animationType="slide" transparent>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Add New {category} Student</Text>
              
              <TextInput
                label="Name"
                value={newStudent.name}
                onChangeText={(text) => setNewStudent({ ...newStudent, name: text })}
                mode="outlined"
                style={styles.input}
              />
              <TextInput
                label="ID"
                value={newStudent.id}
                onChangeText={(text) => setNewStudent({ ...newStudent, id: text })}
                mode="outlined"
                style={styles.input}
              />
              <TextInput
                label="Age"
                value={newStudent.age}
                onChangeText={(text) => setNewStudent({ ...newStudent, age: text })}
                mode="outlined"
                style={styles.input}
                keyboardType="numeric"
              />
              <TextInput
                label="Date of Birth (YYYY-MM-DD)"
                value={newStudent.dob}
                onChangeText={(text) => setNewStudent({ ...newStudent, dob: text })}
                mode="outlined"
                style={styles.input}
              />
              <Button
                mode="outlined"
                onPress={pickImage}
                style={styles.input}
              >
                {imageFile ? 'Image Selected' : 'Pick Image'}
              </Button>
              <TextInput
                label="Email"
                value={newStudent.email}
                onChangeText={(text) => setNewStudent({ ...newStudent, email: text })}
                mode="outlined"
                style={styles.input}
                autoCapitalize="none"
              />
              <TextInput
                label="Password"
                value={newStudent.password}
                onChangeText={(text) => setNewStudent({ ...newStudent, password: text })}
                mode="outlined"
                style={styles.input}
                secureTextEntry
              />

              <Button
                mode="contained"
                onPress={handleAddStudent}
                style={styles.modalButton}
                buttonColor="#FF5733"
              >
                Add Student
              </Button>
              <Button
                mode="outlined"
                onPress={() => {
                  setModalVisible(false);
                  setImageFile(null);
                }}
                style={styles.modalButton}
              >
                Cancel
              </Button>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

// Styles remain unchanged
const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  searchBar: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF5733',
    textAlign: 'center',
    marginBottom: 20,
  },
  grid: {
    flex: 1,
  },
  card: {
    width: '48%',
    elevation: 4,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 15,
    marginRight: 10,
  },
  cardImage: {
    height: 80,
  },
  cardContent: {
    backgroundColor: '#FF5733',
    paddingVertical: 5,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#fff',
    textAlign: 'center',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FF5733',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 30,
    color: '#fff',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 15,
  },
  modalButton: {
    marginTop: 10,
  },
});

export default StudentListScreen;