import { SafeAreaView, StyleSheet, Text, View, Image, TextInput, Pressable, ActivityIndicator } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native'; 
import ErrorMessage from './ErrorMessage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const validationSchema = Yup.object().shape({
  email: Yup.string().required("Email is required").email("Invalid email").label("Email"),
  password: Yup.string().required("Password is required").min(4, "Password must be at least 4 characters").label("Password"),
});

// Default admin credentials
const adminEmail = 'sduisaac@gmail.com';
const adminPassword = 'Cyrus';

// Default teacher credentials (you can add more or load from storage)
const teacherCredentials = [
  { email: 'teacher1@example.com', password: 'teacher1', name: 'John Doe' },
  { email: 'teacher2@example.com', password: 'teacher2', name: 'Jane Smith' }
];

function LoginScreen(props) {
  const navigation = useNavigation(); 
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);

  // Load students from AsyncStorage on component mount
  useEffect(() => {
    const loadStudents = async () => {
      try {
        const storedStudents = await AsyncStorage.getItem('students');
        if (storedStudents !== null) {
          const parsedStudents = JSON.parse(storedStudents);
          // Filter out invalid student entries
          const validStudents = parsedStudents.filter(s => 
            s && typeof s.email === 'string' && typeof s.password === 'string'
          );
          setStudents(validStudents);
          console.log('Loaded students in LoginScreen:', validStudents);
          if (parsedStudents.length !== validStudents.length) {
            console.warn('Filtered out invalid students:', parsedStudents.filter(s => !validStudents.includes(s)));
          }
        } else {
          console.log('No students found in AsyncStorage');
        }
      } catch (error) {
        console.error('Failed to load students', error);
      }
    };
    
    loadStudents();
  }, []);

  const handleLogin = (values) => {
    const { email, password } = values;
    const normalizedEmail = email ? email.trim().toLowerCase() : ''; // Fallback to empty string if undefined
    const normalizedPassword = password ? password.trim() : ''; // Fallback to empty string if undefined
    setLoading(true);
    
    console.log('Login attempt with:', { email: normalizedEmail, password: normalizedPassword });
    
    // Check if admin
    if (normalizedEmail === adminEmail && normalizedPassword === adminPassword) {
      setLoginError('');
      setTimeout(() => {
        setLoading(false);
        navigation.navigate('AdminDashboard');
      }, 100);
      return;
    }
    
    // Check if teacher
    const teacher = teacherCredentials.find(t => t.email === normalizedEmail && t.password === normalizedPassword);
    if (teacher) {
      setLoginError('');
      setTimeout(() => {
        setLoading(false);
        navigation.navigate('TeacherDashboard', { teacherName: teacher.name });
      }, 100);
      return;
    }
    
    // Check if student
    console.log('Current students array:', students);
    const student = students.find(s => {
      const studentEmail = s.email && typeof s.email === 'string' ? s.email.trim().toLowerCase() : '';
      const studentPassword = s.password && typeof s.password === 'string' ? s.password.trim() : '';
      const match = studentEmail === normalizedEmail && studentPassword === normalizedPassword;
      console.log(`Checking student: ${studentEmail} === ${normalizedEmail} && ${studentPassword} === ${normalizedPassword} -> ${match}`);
      return match;
    });
    
    if (student) {
      setLoginError('');
      setTimeout(() => {
        setLoading(false);
        navigation.navigate('StudentDashboard', { 
          studentId: student.studentId, 
          studentName: student.name, 
          level: student.level 
        });
      }, 100);
      return;
    }
    
    setLoading(false);
    setLoginError('Incorrect login details');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image
        style={styles.logo}
        source={require('../assets/images/logo.png')}
      />
      
      <Text style={styles.welcomeText}>Welcome Back</Text>
      <Text style={styles.subtitleText}>Sign in to continue</Text>

      <Formik
        initialValues={{ email: '', password: '' }}
        onSubmit={handleLogin}
        validationSchema={validationSchema}
      >
        {({ handleChange, handleSubmit, errors, setFieldTouched, touched }) => (
          <>
            <TextInput
              style={styles.input}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              onBlur={() => setFieldTouched("email")}
              onChangeText={handleChange("email")}
              placeholder="Email"
              textContentType="emailAddress"
            />
            <ErrorMessage error={errors.email} visible={touched.email} />

            <TextInput
              style={styles.input}
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={handleChange("password")}
              onBlur={() => setFieldTouched("password")}
              placeholder="Password"
              secureTextEntry={true}
              textContentType="password"
            />
            <ErrorMessage error={errors.password} visible={touched.password} />

            {loginError ? <Text style={styles.errorText}>{loginError}</Text> : null}

            {loading ? (
              <ActivityIndicator size="large" color="#FF5733" style={styles.loader} />
            ) : (
              <Pressable style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Login</Text>
              </Pressable>
            )}
          </>
        )}
      </Formik>
    </SafeAreaView>
  );
}

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginTop: 50,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitleText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#F0F0F0',
    height: 50,
    marginVertical: 10,
    borderRadius: 20,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#FF5733',
    height: 50,
    marginVertical: 20,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
    fontWeight: 'bold',
  },
  loader: {
    marginTop: 20,
    alignSelf: 'center',
  },
});