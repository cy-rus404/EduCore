// UsersScreen.js
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  StyleSheet, 
  TextInput, 
  Button, 
  ActivityIndicator,
  Alert,
  Modal
} from 'react-native';
import { createClient } from '@supabase/supabase-js';
import * as ImagePicker from 'react-native-image-picker';

// Initialize Supabase
const supabase = createClient('https://wwdnoklxfhjtnptnhsgx.supabase.co', 'eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3ZG5va2x4ZmhqdG5wdG5oc2d4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM1MDY5NjksImV4cCI6MjA1OTA4Mjk2OX0');

const StudentItem = ({ student }) => (
  <View style={styles.studentItem}>
    <Image source={{ uri: student.image }} style={styles.studentImage} />
    <View>
      <Text style={styles.studentName}>{student.name}</Text>
      <Text style={styles.studentId}>ID: {student.id}</Text>
    </View>
  </View>
);

const AddStudentForm = ({ visible, onAddStudent, onClose }) => {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    age: '',
    dob: '',
    class: '',
    parentName: '',
    image: null,
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.id) newErrors.id = 'Student ID is required';
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.age || isNaN(formData.age) || formData.age < 1) newErrors.age = 'Valid age is required';
    if (!formData.dob || !/^\d{4}-\d{2}-\d{2}$/.test(formData.dob)) newErrors.dob = 'Valid date (YYYY-MM-DD) is required';
    if (!formData.class) newErrors.class = 'Class is required';
    if (!formData.parentName) newErrors.parentName = 'Parent name is required';
    if (!formData.image) newErrors.image = 'Image is required';
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Valid email is required';
    if (!formData.password || formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibrary({
      mediaType: 'photo',
      quality: 1,
    });

    if (!result.didCancel && result.assets) {
      setFormData({ ...formData, image: result.assets[0] });
      setErrors({ ...errors, image: undefined });
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Upload image to Supabase Storage
      const fileExt = formData.image.fileName.split('.').pop();
      const fileName = `${formData.id}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('student-images')
        .upload(fileName, formData.image);

      if (uploadError) throw uploadError;

      const { data: imageData } = supabase.storage
        .from('student-images')
        .getPublicUrl(fileName);

      // Sign up user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;

      // Insert student data
      const { data, error } = await supabase
        .from('students')
        .insert([{
          id: formData.id,
          name: formData.name,
          age: parseInt(formData.age),
          dob: formData.dob,
          class: formData.class,
          parent_name: formData.parentName,
          image: imageData.publicUrl,
          email: formData.email,
          user_id: authData.user.id
        }]);

      if (error) throw error;

      onAddStudent({
        id: formData.id,
        name: formData.name,
        image: imageData.publicUrl
      });

      // Reset form and close
      resetForm();
      onClose();
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      age: '',
      dob: '',
      class: '',
      parentName: '',
      image: null,
      email: '',
      password: ''
    });
    setErrors({});
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.formContainer}>
          <TextInput
            style={[styles.input, errors.id && styles.inputError]}
            placeholder="Student ID"
            value={formData.id}
            onChangeText={text => setFormData({ ...formData, id: text })}
          />
          {errors.id && <Text style={styles.errorText}>{errors.id}</Text>}

          <TextInput
            style={[styles.input, errors.name && styles.inputError]}
            placeholder="Name"
            value={formData.name}
            onChangeText={text => setFormData({ ...formData, name: text })}
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

          <TextInput
            style={[styles.input, errors.age && styles.inputError]}
            placeholder="Age"
            value={formData.age}
            onChangeText={text => setFormData({ ...formData, age: text })}
            keyboardType="numeric"
          />
          {errors.age && <Text style={styles.errorText}>{errors.age}</Text>}

          <TextInput
            style={[styles.input, errors.dob && styles.inputError]}
            placeholder="Date of Birth (YYYY-MM-DD)"
            value={formData.dob}
            onChangeText={text => setFormData({ ...formData, dob: text })}
          />
          {errors.dob && <Text style={styles.errorText}>{errors.dob}</Text>}

          <TextInput
            style={[styles.input, errors.class && styles.inputError]}
            placeholder="Class"
            value={formData.class}
            onChangeText={text => setFormData({ ...formData, class: text })}
          />
          {errors.class && <Text style={styles.errorText}>{errors.class}</Text>}

          <TextInput
            style={[styles.input, errors.parentName && styles.inputError]}
            placeholder="Parent Name"
            value={formData.parentName}
            onChangeText={text => setFormData({ ...formData, parentName: text })}
          />
          {errors.parentName && <Text style={styles.errorText}>{errors.parentName}</Text>}

          <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
            <Text>{formData.image ? 'Image Selected' : 'Select Student Image'}</Text>
          </TouchableOpacity>
          {errors.image && <Text style={styles.errorText}>{errors.image}</Text>}

          <TextInput
            style={[styles.input, errors.email && styles.inputError]}
            placeholder="Email"
            value={formData.email}
            onChangeText={text => setFormData({ ...formData, email: text })}
            keyboardType="email-address"
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

          <TextInput
            style={[styles.input, errors.password && styles.inputError]}
            placeholder="Password"
            value={formData.password}
            onChangeText={text => setFormData({ ...formData, password: text })}
            secureTextEntry
          />
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

          <View style={styles.buttonContainer}>
            <Button 
              title={loading ? "Adding..." : "Add Student"} 
              onPress={handleSubmit} 
              disabled={loading}
            />
            <Button title="Cancel" onPress={onClose} color="red" disabled={loading} />
          </View>
          {loading && <ActivityIndicator size="large" color="#007AFF" />}
        </View>
      </View>
    </Modal>
  );
};

const UsersScreen = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('students')
        .select('id, name, image');
      
      if (error) throw error;
      setStudents(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = (newStudent) => {
    setStudents([...students, newStudent]);
    setShowForm(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Students</Text>
      {loading && !students.length ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        <FlatList
          data={students}
          renderItem={({ item }) => <StudentItem student={item} />}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={<Text style={styles.emptyText}>No students found</Text>}
        />
      )}
      
      <AddStudentForm 
        visible={showForm}
        onAddStudent={handleAddStudent}
        onClose={() => setShowForm(false)}
      />
      
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => setShowForm(true)}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 40,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  listContainer: {
    paddingHorizontal: 10,
  },
  studentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    elevation: 2,
  },
  studentImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '500',
  },
  studentId: {
    fontSize: 14,
    color: '#666',
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ff5733',
    justifyContent: 'center',
    alignItems: 'center',
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
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    margin: 20,
    elevation: 3,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
  },
  imageButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },
});

export default UsersScreen;