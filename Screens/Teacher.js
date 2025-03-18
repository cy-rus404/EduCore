import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, FlatList, Modal, Alert, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

const COURSES = ['English', 'French', 'Math', 'OWOP', 'RME', 'Science', 'Creative Arts'];

const Teachers = ({ navigation }) => {
  const [teachers, setTeachers] = useState([]);
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [newTeacher, setNewTeacher] = useState({
    name: '',
    age: '',
    image: null,
    courses: [],
  });

  useEffect(() => {
    loadTeachers();
  }, []);

  const loadTeachers = async () => {
    try {
      const storedTeachers = await AsyncStorage.getItem('teachers');
      if (storedTeachers) {
        setTeachers(JSON.parse(storedTeachers));
      }
    } catch (error) {
      console.error('Failed to load teachers', error);
    }
  };

  const saveTeachers = async (updatedTeachers) => {
    try {
      await AsyncStorage.setItem('teachers', JSON.stringify(updatedTeachers));
      setTeachers(updatedTeachers);
    } catch (error) {
      console.error('Failed to save teachers', error);
    }
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
      setNewTeacher({ ...newTeacher, image: result.assets[0].uri });
    }
  };

  const toggleCourse = (course) => {
    const updatedCourses = newTeacher.courses.includes(course)
      ? newTeacher.courses.filter(c => c !== course)
      : [...newTeacher.courses, course];
    setNewTeacher({ ...newTeacher, courses: updatedCourses });
  };

  const addTeacher = () => {
    if (!newTeacher.name || !newTeacher.age || !newTeacher.image || newTeacher.courses.length === 0) {
      Alert.alert('Incomplete Information', 'Please fill in all fields and select at least one course.');
      return;
    }

    const teacher = {
      id: Date.now().toString(),
      name: newTeacher.name,
      age: newTeacher.age,
      image: newTeacher.image,
      courses: newTeacher.courses,
    };

    const updatedTeachers = [...teachers, teacher];
    saveTeachers(updatedTeachers);
    setAddModalVisible(false);
    setNewTeacher({ name: '', age: '', image: null, courses: [] });
  };

  const renderTeacherItem = ({ item }) => (
    <View style={styles.teacherItem}>
      <Image
        source={{ uri: item.image || 'https://via.placeholder.com/50' }}
        style={styles.teacherImage}
      />
      <View style={styles.teacherInfo}>
        <Text style={styles.teacherName}>{item.name}</Text>
        <Text style={styles.teacherDetail}>Age: {item.age}</Text>
        <Text style={styles.teacherDetail}>Courses: {item.courses.join(', ')}</Text>
      </View>
    </View>
  );

  const renderCourseOption = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.courseButton,
        newTeacher.courses.includes(item) && styles.courseButtonSelected,
      ]}
      onPress={() => toggleCourse(item)}
    >
      <Text style={[
        styles.courseText,
        newTeacher.courses.includes(item) && styles.courseTextSelected,
      ]}>
        {item}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Manage Teachers</Text>
      <FlatList
        data={teachers}
        keyExtractor={(item) => item.id}
        renderItem={renderTeacherItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<Text style={styles.noDataText}>No teachers added yet.</Text>}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setAddModalVisible(true)}
      >
        <Text style={styles.addButtonText}>+ Add Teacher</Text>
      </TouchableOpacity>

      {/* Add Teacher Modal */}
      <Modal
        visible={isAddModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setAddModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Teacher</Text>

            {newTeacher.image ? (
              <Image source={{ uri: newTeacher.image }} style={styles.modalImage} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text>No Image Selected</Text>
              </View>
            )}
            <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
              <Text style={styles.imageButtonText}>Pick Image</Text>
            </TouchableOpacity>

            <TextInput
              style={styles.input}
              placeholder="Enter teacher name"
              value={newTeacher.name}
              onChangeText={(text) => setNewTeacher({ ...newTeacher, name: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter teacher age"
              value={newTeacher.age}
              onChangeText={(text) => setNewTeacher({ ...newTeacher, age: text })}
              keyboardType="numeric"
            />

            <Text style={styles.courseLabel}>Assign Courses:</Text>
            <FlatList
              data={COURSES}
              keyExtractor={(item) => item}
              renderItem={renderCourseOption}
              numColumns={2}
              columnWrapperStyle={styles.courseRow}
            />

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.saveButton} onPress={addTeacher}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setAddModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Back to Dashboard</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 40,
  },
  listContainer: {
    paddingBottom: 80,
  },
  teacherItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  teacherImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  teacherInfo: {
    flex: 1,
  },
  teacherName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  teacherDetail: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  addButton: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    backgroundColor: '#FF5733',
    padding: 15,
    borderRadius: 10,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
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
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  imagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e1e1e1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  imageButton: {
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  imageButtonText: {
    color: '#333',
    fontSize: 14,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  courseLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  courseRow: {
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  courseButton: {
    width: '48%',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
  },
  courseButtonSelected: {
    backgroundColor: '#FF5733',
    borderColor: '#FF5733',
  },
  courseText: {
    fontSize: 14,
    color: '#333',
  },
  courseTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: '#FF5733',
    padding: 15,
    borderRadius: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#ccc',
    padding: 15,
    borderRadius: 10,
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
  noDataText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  backButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#ccc',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default Teachers;